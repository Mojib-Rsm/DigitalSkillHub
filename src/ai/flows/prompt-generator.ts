
'use server';

/**
 * @fileOverview AI tool to generate detailed prompts for various media types.
 *
 * - promptGenerator - A function that generates a detailed prompt.
 * - PromptGeneratorInput - The input type for the promptGenerator function.
 * - PromptGeneratorOutput - The return type for the promptGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptGeneratorInputSchema = z.object({
  topic: z.string().describe('The user\'s core idea or topic for the prompt.'),
  mediaType: z.enum(['Image', 'Video', 'Audio']).describe('The type of media the prompt is for.'),
  language: z.enum(['Bengali', 'English']).describe('The desired language for the generated prompt.'),
});
export type PromptGeneratorInput = z.infer<typeof PromptGeneratorInputSchema>;

const PromptGeneratorOutputSchema = z.object({
  generatedPrompt: z.string().describe('The detailed, AI-generated prompt.'),
});
export type PromptGeneratorOutput = z.infer<typeof PromptGeneratorOutputSchema>;

export async function promptGenerator(input: PromptGeneratorInput): Promise<PromptGeneratorOutput> {
  return promptGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptGeneratorPrompt',
  input: {schema: PromptGeneratorInputSchema},
  output: {schema: PromptGeneratorOutputSchema},
  prompt: `You are an expert prompt engineer. Your task is to expand a user's simple idea into a detailed, effective, and well-structured prompt for an AI generation model.

User's Idea/Topic: {{{topic}}}
Desired Media Type: {{{mediaType}}}
Desired Language for the Prompt: {{{language}}}

Based on this, generate a comprehensive prompt in the specified language.

If the media type is 'Image', the prompt should be very descriptive, including details about the subject, setting, style, lighting, composition, and mood.
Example for Image: "A photorealistic image of a majestic Bengal tiger gracefully walking through a dense, misty mangrove forest in the Sundarbans. The early morning golden sunlight filters through the canopy, creating dramatic light and shadow. The tiger's fur is detailed and wet. The style should be cinematic, with a shallow depth of field."

If the media type is 'Video', the prompt should describe a sequence of actions, camera movements, and the overall narrative or mood of the video.
Example for Video: "A 5-second cinematic video shot. A drone flies slowly over a vast, lush green tea garden in Sylhet, Bangladesh. It's a misty morning, and tea pickers are working. The shot is wide, capturing the serene beauty of the landscape. The mood is peaceful and calm."

If the media type is 'Audio', the prompt should describe the sounds, background noises, speaker's tone (if any), and the overall atmosphere you want to create.
Example for Audio: "Generate an audio clip of a bustling Dhaka street market. Include the sounds of vendors shouting in Bengali, rickshaw bells ringing, people bargaining, and the general hum of a crowd. The atmosphere should be energetic and lively."

Now, generate the detailed prompt for the user's request. The final output should only be the generated prompt itself, in the requested language.`,
});

const promptGeneratorFlow = ai.defineFlow(
  {
    name: 'promptGeneratorFlow',
    inputSchema: PromptGeneratorInputSchema,
    outputSchema: PromptGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
