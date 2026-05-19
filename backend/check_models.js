const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key found in .env file!');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log('Fetching available models for your API key...');
    // Correct way to list models in the newer SDK versions
    const result = await genAI.listModels();
    
    console.log('\nAvailable Models:');
    result.models.forEach((model) => {
      console.log(`- ${model.name} (Supports: ${model.supportedGenerationMethods.join(', ')})`);
    });
  } catch (error) {
    console.error('Error fetching models:', error.message);
    console.log('\nTip: Make sure your API key is correct and has the "Generative Language API" enabled in Google Cloud Console.');
  }
}

checkModels();
