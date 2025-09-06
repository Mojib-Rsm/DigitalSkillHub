
'use server';

/**
 * @fileOverview AI tool to edit an image based on a text prompt.
 *
 * - imageEditor - A function that edits an image.
 * - ImageEditorInput - The input type for the imageEditor function.
 * - ImageEditorOutput - The return type for the imageEditor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageEditorInputSchema = z.object({
  prompt: z.string().describe('The text prompt describing the desired edits.'),
  photoDataUri: z
    .string()
    .describe(
      "The photo to be edited, as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageEditorInput = z.infer<typeof ImageEditorInputSchema>;

const ImageEditorOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the edited image.'),
});
export type ImageEditorOutput = z.infer<typeof ImageEditorOutputSchema>;

export async function imageEditor(input: ImageEditorInput): Promise<ImageEditorOutput> {
  return imageEditorFlow(input);
}

const imageEditorFlow = ai.defineFlow(
  {
    name: 'imageEditorFlow',
    inputSchema: ImageEditorInputSchema,
    outputSchema: ImageEditorOutputSchema,
  },
  async (input) => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
            {media: {url: input.photoDataUri}},
            {text: input.prompt},
        ],
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
          throw new Error('Image editing failed to produce a valid URL. The model may have refused to generate the image based on the prompt.');
      }

      return {imageUrl: media.url};
    } catch (error) {
        console.error("Error in imageEditorFlow:", error);
        if (error instanceof Error) {
            // Re-throw with a more user-friendly message
            throw new Error(`Failed to edit image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image editing.");
    }
  }
);
