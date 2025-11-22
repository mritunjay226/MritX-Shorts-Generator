const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const generateScript = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Write 2 viral short video scripts (30-45 seconds) on the topic: "{topic}".
Language: Hinglish (Conversational, engaging).
Structure for each script:
1. **Hook (0-5s)**: Grab attention immediately (Shocking fact, Question, or Mystery).
2. **Body**: Tell a compelling story or explain the fact with high energy. Keep sentences short.
3. **Conclusion**: A strong ending or call to action.
Constraints:
- No scene descriptions or speaker labels.
- No text in brackets/braces.
- Focus on storytelling and emotion, not just dry facts.
- Make it sound like a popular YouTuber/Influencer.
Return JSON format:
{
  "scripts": [
    { "content": "...", "mood": "..." },
    { "content": "...", "mood": "..." }
  ]
}`,
        },
      ],
    },
  ],
});

export const generateImagePrompt = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        { text: "Generate Image prompt of Cinematic style woth all details for each scene for 30 seconds video : script: Rosa Parks refused to give up her seat on a bus in 1955.Her quite act of defiance sparked the Montgomery Bus Boycott, a pivotal moment in the Civil Rights Movement. One person's bravery can inspire lasting change for everyone." }
      ]
    },
    {
      role: "model",
      parts: [
        { text: "```json\n[\n  {\n    \"imagePrompt\": \"A dimly lit interior of a 1950s public bus, filled with passengers. The seats are upholstered in a patterned fabric, and natural light filters through the windows. Focus on the expressions and period-appropriate clothing of the passengers, showing a mix of everyday life and subtle tension.\",\n    \"scriptContent\": \"Sample script content here.\"\n  }\n]\n```" }
      ]
    }
  ]
})
