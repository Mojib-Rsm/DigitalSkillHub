'use server';

import { textToSpeechFlow, TextToSpeechOutput } from "@/ai/flows/text-to-speech";

export async function textToSpeech(text: string): Promise<TextToSpeechOutput> {
  try {
    const result = await textToSpeechFlow(text);
    return result;
  } catch (error) {
    console.error("Error in textToSpeech server action:", error);
    throw new Error("Failed to generate audio.");
  }
}
