
'use server';

/**
 * @fileOverview AI tool to generate digital stamps.
 *
 * - digitalStampMaker - A function that generates a digital stamp.
 * - DigitalStampMakerInput - The input type for the function.
 * - DigitalStampMakerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DigitalStampMakerInputSchema = z.object({
  companyName: z.string().describe('The name of the company or institution for the stamp.'),
  tagline: z.string().optional().describe('An optional tagline or slogan.'),
  shape: z.enum(['Circle', 'Square', 'Rectangle']).describe('The shape of the stamp.'),
  style: z.string().describe('The desired style (e.g., modern, vintage, official).'),
});
export type DigitalStampMakerInput = z.infer<typeof DigitalStampMakerInputSchema>;

const DigitalStampMakerOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated stamp image.'),
});
export type DigitalStampMakerOutput = z.infer<typeof DigitalStampMakerOutputSchema>;

export async function digitalStampMaker(input: DigitalStampMakerInput): Promise<DigitalStampMakerOutput> {
  return digitalStampMakerFlow(input);
}

const digitalStampMakerFlow = ai.defineFlow(
  {
    name: 'digitalStampMakerFlow',
    inputSchema: DigitalStampMakerInputSchema,
    outputSchema: DigitalStampMakerOutputSchema,
  },
  async (input) => {
    try {
      const prompt = `Generate a digital stamp.
      Shape: ${input.shape}.
      Company Name: '${input.companyName}'.
      ${input.tagline ? `Tagline: '${input.tagline}'.` : ''}
      Style: ${input.style}, vector, logo, high-resolution, transparent background. The text must be clearly readable.`;

      const {media} = await ai.generate({
        model: 'googleai/gemini-pro-image-generation-preview',
        prompt: prompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
           safetySettings: [
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_ONLY_HIGH',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        },
      });
      
      if (!media?.url) {
          throw new Error('Image generation failed to produce a valid URL. The model may have refused to generate the image based on the prompt.');
      }

      return {imageUrl: media.url};
    } catch (error) {
        console.error("Error in digitalStampMakerFlow:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate stamp: ${error.message}`);
        }
        throw new Error("An unknown error occurred during stamp generation.");
    }
  }
);
