import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { resolve } from "path";

// Load environment variables from the .env file in the current directory
dotenv.config({ path: resolve(process.cwd(), ".env") });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.error("❌ Error: GEMINI_API_KEY is not set correctly in backend/.env");
    process.exit(1);
}

async function listAvailableModels() {
    try {
        console.log("🔍 HealthPath AI | Fetching available models for your API key...\n");

        // We use the raw fetch to get the most detailed list possible
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || response.statusText);
        }

        const data: any = await response.json();

        if (data.models && data.models.length > 0) {
            console.log(`✅ Success! Found ${data.models.length} models:\n`);
            
            // Sort models by name for better readability
            const sortedModels = data.models.sort((a: any, b: any) => a.name.localeCompare(b.name));

            sortedModels.forEach((model: any) => {
                const name = model.name.replace('models/', '');
                console.log(`\x1b[36m[${name}]\x1b[0m`);
                console.log(`   DisplayName: ${model.displayName}`);
                console.log(`   Description: ${model.description}`);
                console.log(`   Methods:     ${model.supportedGenerationMethods.join(', ')}`);
                console.log('--------------------------------------------------');
            });
            
            console.log("\n💡 Tip: Use 'gemini-1.5-flash' or 'gemini-2.0-flash' for best results in your chatbot.");
        } else {
            console.log("❓ No models found in the response. Check if your API key has the correct permissions.");
        }
    } catch (error: any) {
        console.error("❌ AI Service Error:", error.message);
        if (error.message.includes("API key not valid")) {
            console.log("👉 Tip: Please check your API key in backend/.env");
        }
    }
}

listAvailableModels();
