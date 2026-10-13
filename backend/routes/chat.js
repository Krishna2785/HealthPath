const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Initialize Gemini ONCE (not inside request)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Cache system prompt and loaded DB data so we don't query Mongo on every chat message
let cachedPrompt = null;
let cachedDoctors = [];
let cachedHospitals = [];
let cacheTime = null;

async function buildSystemPrompt() {
  const now = Date.now();
  // Refresh cache every 5 minutes
  if (cachedPrompt && cacheTime && (now - cacheTime) < 5 * 60 * 1000) {
    return cachedPrompt;
  }

  const hospitals = await Hospital.find().lean();
  const doctors = await Doctor.find().lean();
  cachedHospitals = hospitals;
  cachedDoctors = doctors;

  const hospitalList = hospitals.length
    ? hospitals.map(h =>
      `- ${h.name} (${h.distanceStr || 'N/A'}): Specialities: ${(h.specialities || []).join(', ') || 'N/A'}. Timings: ${h.timings || 'N/A'}`
    ).join('\n')
    : 'No hospitals available';

  const doctorList = doctors.length
    ? doctors.map(d => {
      const cleanName = d.name.replace(/^Dr\.\s*/i, '');
      return `- Dr. ${cleanName} | ${d.speciality || 'N/A'} | ${d.experience || 'N/A'} experience | Fee: ₹${d.fee || 'N/A'} | Available: ${(d.availability || []).join(', ') || 'N/A'}`;
    }).join('\n')
    : 'No doctors available';

  cachedPrompt = `You are HealthPath AI, a friendly and knowledgeable medical assistant for the HealthPath platform.

Your role is to:
1. Listen to the user's symptoms or health concerns with empathy.
2. Suggest which **type of specialist or doctor** they should consult.
3. Recommend **specific doctors and hospitals** from our platform when relevant.
4. Always remind users that your suggestions are NOT a medical diagnosis.
5. Keep responses concise, warm, and easy to understand.
6. If asked about booking, guide users to the "Book Appointment" section.

=== AVAILABLE HOSPITALS ===
${hospitalList}

=== AVAILABLE DOCTORS ===
${doctorList}

Important rules:
- Never diagnose diseases.
- Emergency symptoms → tell user to go to nearest ER immediately.
- Be compassionate and professional.
- Reply in same language (English/Hindi).`;

  cacheTime = now;
  return cachedPrompt;
}

// Contextual assistant fallback using MongoDB doctors and hospitals, guarded against empty arrays
function generateFallbackReply(messages = [], doctors = [], hospitals = []) {
  const docList = Array.isArray(doctors) ? doctors : [];
  const hospList = Array.isArray(hospitals) ? hospitals : [];

  // Guard: if no doctors or hospitals are available in database
  if (docList.length === 0 && hospList.length === 0) {
    return 'Thank you for reaching out. Our specialist directory is currently being updated. If you are experiencing concerning symptoms, please consult a healthcare professional or visit the nearest medical center. Please note that this is not a medical diagnosis.';
  }

  const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.text?.toLowerCase() || '';
  const conversationText = messages.map(m => m.text || '').join(' ').toLowerCase();

  // Knee / Joint / Bone / Orthopedic symptoms
  if (conversationText.includes('knee') || conversationText.includes('bone') || conversationText.includes('joint') || conversationText.includes('ortho')) {
    const orthoDoc = docList.find(d => /ortho/i.test(d.speciality)) || docList[0];
    const hospital = hospList.find(h => h.originalId === orthoDoc?.hospitalId) || hospList[0];
    const docName = orthoDoc ? `Dr. ${orthoDoc.name.replace(/^Dr\.\s*/i, '')}` : 'an Orthopedic Specialist';
    const hospName = hospital?.name || 'our partner hospital';

    if (lastUserMsg.includes('fee') || lastUserMsg.includes('cost') || lastUserMsg.includes('charge')) {
      return `${docName}'s consultation fee is ₹${orthoDoc?.fee || 'N/A'}. You can book an appointment through our Book Appointment section. Please remember this is not a medical diagnosis.`;
    }
    if (lastUserMsg.includes('time') || lastUserMsg.includes('available') || lastUserMsg.includes('when') || lastUserMsg.includes('schedule')) {
      return `${docName} is available on ${(orthoDoc?.availability || []).join(', ') || 'selected weekdays'}. You can book available slots at ${hospName}. Please note this is not a medical diagnosis.`;
    }
    if (lastUserMsg.includes('where') || lastUserMsg.includes('hospital') || lastUserMsg.includes('location')) {
      return `${docName} practices at ${hospName}. You can review the hospital details and schedule a visit on HealthPath. Please note this is not a medical diagnosis.`;
    }
    return `I am sorry to hear you are experiencing knee pain. For knee or joint concerns, I recommend consulting an Orthopedic specialist. On HealthPath, you can visit ${docName} (${orthoDoc?.speciality || 'Orthopedics'}) at ${hospName}. Please note that this is not a medical diagnosis; if you experience severe swelling or inability to bear weight, seek emergency care immediately.`;
  }

  // Chest / Heart / Cardiology symptoms
  if (conversationText.includes('chest') || conversationText.includes('heart') || conversationText.includes('cardio')) {
    const cardioDoc = docList.find(d => /cardio/i.test(d.speciality)) || docList[0];
    const hospital = hospList.find(h => h.originalId === cardioDoc?.hospitalId) || hospList[0];
    const docName = cardioDoc ? `Dr. ${cardioDoc.name.replace(/^Dr\.\s*/i, '')}` : 'a Cardiologist';
    const hospName = hospital?.name || 'our partner hospital';
    return `For chest or heart-related symptoms, you should consult a Cardiologist. On our platform, we have ${docName} (${cardioDoc?.speciality || 'Cardiology'}) at ${hospName}. Please note this is not a medical diagnosis; for acute chest pain or difficulty breathing, please visit the nearest ER immediately.`;
  }

  // General medicine fallback
  const generalDoc = docList.find(d => /general/i.test(d.speciality)) || docList[0];
  const generalHosp = hospList.find(h => h.originalId === generalDoc?.hospitalId) || hospList[0];
  const docName = generalDoc ? `Dr. ${generalDoc.name.replace(/^Dr\.\s*/i, '')}` : 'a General Physician';
  const hospName = generalHosp?.name || 'our partner hospital';
  return `Thank you for sharing your symptoms. Based on our platform, you can consult ${docName} (${generalDoc?.speciality || 'General Medicine'}) at ${hospName}. Please note that this is not a medical diagnosis.`;
}

// Rate limiter: 10 requests per minute per IP on /api/chat
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 10,
  message: { error: 'Too many chat requests. Please wait a moment and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET /api/chat/health — checks Gemini connectivity
router.get('/health', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({ gemini: 'failing', reason: 'GEMINI_API_KEY is not set' });
    }
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('ping');
    const text = result?.response?.text();
    if (text) {
      return res.json({ gemini: 'ok' });
    }
    return res.json({ gemini: 'failing', reason: 'Empty response received from Gemini' });
  } catch (error) {
    return res.json({ gemini: 'failing', reason: error.message });
  }
});

// POST /api/chat
router.post('/', chatLimiter, async (req, res) => {
  try {
    const { messages } = req.body;

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Validate each message has role and text
    for (const msg of messages) {
      if (!msg.role || typeof msg.text !== 'string') {
        return res.status(400).json({ error: 'Each message must have a role and text field' });
      }
    }

    // Reject messages that are too long (last user message)
    const lastMessage = messages[messages.length - 1].text;
    if (lastMessage.length > 1000) {
      return res.status(400).json({ error: 'Message too long. Please keep it under 1000 characters.' });
    }

    // Build the system prompt from MongoDB (cached for 5 minutes)
    const systemPrompt = await buildSystemPrompt();

    // Model name read from process.env.GEMINI_MODEL with sensible default
    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // Create model with systemInstruction so it applies to EVERY turn
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });

    // Convert history (all messages except the last one)
    let history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Gemini requires history to start with a user message
    const firstUserIndex = history.findIndex(m => m.role === 'user');
    history = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    // Retry logic with exponential backoff for 429 errors from Google Gemini
    const withRetry = async (fn, retries = 3, delay = 2000) => {
      try {
        return await fn();
      } catch (err) {
        if (retries > 0 && err.message && err.message.includes('429')) {
          console.log(`Gemini rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return withRetry(fn, retries - 1, delay * 2);
        }
        throw err;
      }
    };

    try {
      const chat = model.startChat({ history });
      const result = await withRetry(() => chat.sendMessage(lastMessage));
      const reply = result.response.text();
      return res.json({ reply, source: 'gemini' });
    } catch (apiError) {
      // Rate limits must return HTTP 429, never fallback
      if (apiError.message && (apiError.message.includes('429') || apiError.status === 429)) {
        return res.status(429).json({
          error: 'Rate limit exceeded. Please wait a few seconds and try again.'
        });
      }

      // Log failure explicitly so failures are never silent
      console.warn('Gemini failed, using fallback:', apiError.message);

      // Only fallback on network, auth/invalid-key, or 5xx/API errors
      const fallbackReply = generateFallbackReply(messages, cachedDoctors, cachedHospitals);
      return res.json({ reply: fallbackReply, source: 'fallback' });
    }

  } catch (error) {
    console.error('Chat error:', error);
    if (error.message && (error.message.includes('429') || error.status === 429)) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a few seconds and try again.'
      });
    }
    res.status(500).json({ error: 'AI service error: ' + error.message });
  }
});

module.exports = router;