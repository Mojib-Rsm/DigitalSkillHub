'use server';

import { textToSpeech } from "@/ai/flows/text-to-speech";
import type { TextToSpeechOutput } from "@/ai/schema/tts";

export async function textToSpeechAction(text: string): Promise<TextToSpeechOutput> {
  try {
    const result = await textToSpeech(text);
    return result;
  } catch (error) {
    console.error("Error in textToSpeech server action:", error);
    throw new Error("Failed to generate audio.");
  }
}
