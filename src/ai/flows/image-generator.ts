
'use server';

/**
 * @fileOverview AI tool to generate images from text prompts.
 *
 * - imageGenerator - A function that generates an image.
 * - ImageGeneratorInput - The input type for the imageGenerator function.
 * - ImageGeneratorOutput - The return type for the imageGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageGeneratorInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate an image from.'),
});
export type ImageGeneratorInput = z.infer<typeof ImageGeneratorInputSchema>;

const ImageGeneratorOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type ImageGeneratorOutput = z.infer<typeof ImageGeneratorOutputSchema>;

export async function imageGenerator(input: ImageGeneratorInput): Promise<ImageGeneratorOutput> {
  return imageGeneratorFlow(input);
}

const imageGeneratorFlow = ai.defineFlow(
  {
    name: 'imageGeneratorFlow',
    inputSchema: ImageGeneratorInputSchema,
    outputSchema: ImageGeneratorOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.prompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media.url) {
        throw new Error('Image generation failed.');
    }

    return {imageUrl: media.url};
  }
);
