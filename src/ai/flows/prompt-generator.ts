'use server';

/**
 * @fileOverview AI tool to generate detailed prompts for various media types from a text topic or an image.
 *
 * - promptGenerator - A function that generates a detailed prompt.
 * - PromptGeneratorInput - The input type for the promptGenerator function.
 * - PromptGeneratorOutput - The return type for the promptGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PromptGeneratorInputSchema = z.object({
  topic: z.string().optional().describe('The user\'s core idea or topic for the prompt.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo to generate prompts from, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  mediaType: z.enum(['Image', 'Video', 'Audio']).describe('The type of media the prompt is for.'),
  language: z.enum(['Bengali', 'English']).describe('The desired language for the generated prompt.'),
});
export type PromptGeneratorInput = z.infer<typeof PromptGeneratorInputSchema>;

const PromptGeneratorOutputSchema = z.object({
  shortPrompts: z.array(z.string()).describe('A list of 2-3 short, concise prompts.'),
  longPrompts: z.array(z.string()).describe('A list of 2-3 long, detailed prompts.'),
});
export type PromptGeneratorOutput = z.infer<typeof PromptGeneratorOutputSchema>;

export async function promptGenerator(input: PromptGeneratorInput): Promise<PromptGeneratorOutput> {
  return promptGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptGeneratorPrompt',
  input: {schema: PromptGeneratorInputSchema},
  output: {schema: PromptGeneratorOutputSchema},
  prompt: `You are an expert prompt engineer. Your task is to expand a user's simple idea or an uploaded image into multiple, effective, and well-structured prompts for an AI generation model.

{{#if topic}}
User's Idea/Topic: {{{topic}}}
{{/if}}

{{#if photoDataUri}}
Analyze the following image to generate prompts. The prompts should describe the image in detail or suggest creative variations and scenarios based on its content.
Image to analyze:
{{media url=photoDataUri}}
{{/if}}

Desired Media Type: {{{mediaType}}}
Desired Language for the Prompt: {{{language}}}

Based on the provided information (topic and/or image), generate a mix of short and long prompts in the specified language.

1.  **Short Prompts (2-3 variations):** Create concise, direct prompts that capture the core idea. These should be quick and to the point.
2.  **Long Prompts (2-3 variations):** Create highly descriptive prompts.
    *   If 'Image', include details about subject, setting, style, lighting, composition, and mood.
    *   If 'Video', describe a sequence of actions, camera movements, and the overall narrative.
    *   If 'Audio', describe sounds, background noises, speaker's tone, and atmosphere.

The final output must be a well-organized JSON object following the defined schema, with all text content in the specified language ({{{language}}}).`,
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
