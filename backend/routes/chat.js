const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Hospital = require('../models/Hospital');
const Doctor = require('../models/Doctor');

const router = express.Router();

// Initialize Gemini ONCE (not inside request)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use latest supported model alias
const model = genAI.getGenerativeModel({
  model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
  generationConfig: {
    maxOutputTokens: 300,
    temperature: 0.7,
  }
});

// Cache system prompt for 5 minutes
let cachedPrompt = null;
let cacheTime = null;

async function buildSystemPrompt() {
  const now = Date.now();
  if (cachedPrompt && cacheTime && (now - cacheTime) < 5 * 60 * 1000) {
    return cachedPrompt;
  }

  const hospitals = await Hospital.find().lean();
  const doctors = await Doctor.find().lean();

  const hospitalList = hospitals.length
    ? hospitals.map(h =>
      `- ${h.name} (${h.distanceStr || 'N/A'}): Specialities: ${(h.specialities || []).join(', ') || 'N/A'}. Timings: ${h.timings || 'N/A'}`
    ).join('\n')
    : 'No hospitals available';

  const doctorList = doctors.length
    ? doctors.map(d =>
      `- Dr. ${d.name} | ${d.speciality || 'N/A'} | ${d.experience || 'N/A'} experience | Fee: ₹${d.fee || 'N/A'} | Available: ${(d.availability || []).join(', ') || 'N/A'}`
    ).join('\n')
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

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key missing in .env' });
    }

    const systemPrompt = await buildSystemPrompt();

    // Convert history properly
    let history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    // Ensure first message is user
    const firstUserIndex = history.findIndex(m => m.role === 'user');
    history = firstUserIndex !== -1 ? history.slice(firstUserIndex) : [];

    const lastMessage = messages[messages.length - 1].text;

    const finalPrompt = history.length === 0
      ? `${systemPrompt}\n\nUser: ${lastMessage}`
      : lastMessage;

    // Retry logic with exponential backoff
    const withRetry = async (fn, retries = 3, delay = 2000) => {
      try {
        return await fn();
      } catch (err) {
        if (retries > 0 && err.message.includes('429')) {
          console.log(`Rate limited. Retrying in ${delay}ms... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return withRetry(fn, retries - 1, delay * 2);
        }
        throw err;
      }
    };

    const chat = model.startChat({ history });
    const result = await withRetry(() => chat.sendMessage(finalPrompt));
    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error('Chat error:', error);

    if (error.message.includes('429')) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please wait a few seconds and try again.'
      });
    }

    if (error.message.includes('API key')) {
      return res.status(401).json({
        error: 'Invalid API key configuration.'
      });
    }

    res.status(500).json({
      error: 'AI service error: ' + error.message
    });
  }
});

module.exports = router;