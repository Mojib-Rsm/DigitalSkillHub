
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
  async (input) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `${input.prompt}. Do not include any text, letters, or numbers in the image.`,
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
        console.error("Error in imageGeneratorFlow:", error);
        if (error instanceof Error) {
            // Re-throw with a more user-friendly message
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
  }
);
