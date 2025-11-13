import { generateScript } from '@/configs/AiModel';
import { NextResponse } from 'next/server';

const SCRIPT_PROMPT = `Write a two different script for 30 Seconds video on Topic:{topic}, 
Do not add Scene description 
Do not Add Anything in Braces, Just return the plain story in text 
Give me response in JSON format and follow the schema
-{
scripts:
[
{content:''},
],
}`;

export async function POST(req) {
  const { topic } = await req.json();

  const PROMPT = SCRIPT_PROMPT.replace("{topic}", topic);
  const result = await generateScript.sendMessage(PROMPT);
  const resp = result?.response?.text();

  console.log("Gemini Response:", resp);

  // ✅ Parse the JSON safely (handles escaped JSON issue)
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(resp);
  } catch {
    try {
      // In case Gemini double-encoded it
      parsedResponse = JSON.parse(JSON.parse(resp));
    } catch {
      parsedResponse = { error: "Invalid or malformed response", raw: resp };
    }
  }

  return NextResponse.json(parsedResponse);
}
