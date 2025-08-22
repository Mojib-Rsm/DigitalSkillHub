
'use server';

/**
 * @fileOverview AI tool to generate scripts for videos.
 *
 * - scriptWriter - A function that generates a script.
 * - ScriptWriterInput - The input type for the scriptWriter function.
 * - ScriptWriterOutput - The return type for the scriptWriter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScriptWriterInputSchema = z.object({
  topic: z.string().describe('The topic of the video.'),
  durationInMinutes: z.number().min(1).max(10).describe('The approximate duration of the video in minutes.'),
  platform: z.enum(['YouTube', 'TikTok']).describe('The platform the video is for.'),
  style: z.string().describe('The desired style of the script (e.g., educational, comedic, dramatic).'),
});
export type ScriptWriterInput = z.infer<typeof ScriptWriterInputSchema>;

const ScriptWriterOutputSchema = z.object({
  script: z.string().describe('The generated script, including scenes, dialogues, and actions.'),
});
export type ScriptWriterOutput = z.infer<typeof ScriptWriterOutputSchema>;

export async function scriptWriter(input: ScriptWriterInput): Promise<ScriptWriterOutput> {
  return scriptWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scriptWriterPrompt',
  input: {schema: ScriptWriterInputSchema},
  output: {schema: ScriptWriterOutputSchema},
  prompt: `You are an expert scriptwriter for online video content. You know how to structure a script to keep viewers engaged.

Write a video script based on the following details. The script should be formatted with scene headings, character names (if any), dialogue, and action descriptions.

Topic: {{{topic}}}
Platform: {{{platform}}}
Approximate Duration: {{{durationInMinutes}}} minutes
Style: {{{style}}}

Create a complete script that is engaging, well-paced, and perfectly suited for the specified platform.`,
});

const scriptWriterFlow = ai.defineFlow(
  {
    name: 'scriptWriterFlow',
    inputSchema: ScriptWriterInputSchema,
    outputSchema: ScriptWriterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
