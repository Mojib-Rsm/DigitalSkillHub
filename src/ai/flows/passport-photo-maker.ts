
'use server';

/**
 * @fileOverview AI tool to generate passport size photos.
 *
 * - passportPhotoMaker - A function that generates a passport photo.
 * - PassportPhotoMakerInput - The input type for the function.
 * - PassportPhotoMakerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const PassportPhotoMakerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A portrait photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  backgroundColor: z.enum(['White', 'Light Blue', 'Grey']).describe('The desired plain background color for the passport photo.'),
});
export type PassportPhotoMakerInput = z.infer<typeof PassportPhotoMakerInputSchema>;

const PassportPhotoMakerOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated passport photo.'),
});
export type PassportPhotoMakerOutput = z.infer<typeof PassportPhotoMakerOutputSchema>;

export async function passportPhotoMaker(input: PassportPhotoMakerInput): Promise<PassportPhotoMakerOutput> {
  return passportPhotoMakerFlow(input);
}

const passportPhotoMakerFlow = ai.defineFlow(
  {
    name: 'passportPhotoMakerFlow',
    inputSchema: PassportPhotoMakerInputSchema,
    outputSchema: PassportPhotoMakerOutputSchema,
  },
  async ({ photoDataUri, backgroundColor }) => {
    try {
      const {media} = await ai.generate({
        model: googleAI.model('gemini-pro'),
        prompt: `You are an expert passport photo processor. Your task is to take the user's uploaded photo and generate a standard passport-size photo. Do NOT generate a new person or face. You must use the original image provided as a reference.

        Follow these instructions precisely:
        1.  **Face and Shoulders:** The output image must be a close-up of the person's head and shoulders from the original photo.
        2.  **Background:** The background must be a plain, uniform ${backgroundColor} background. There should be no shadows or patterns.
        3.  **Image Quality:** Automatically adjust brightness and contrast to make the photo clear and professional. Remove any minor spots, blemishes, or blurriness from the original photo to produce a clean and sharp final image.
        4.  **Expression:** The person should have a neutral facial expression with their eyes open and looking directly at the camera.
        5.  **No Accessories:** Remove any hats, sunglasses, or non-religious head coverings. Prescription glasses are acceptable but should not have glare.
        6.  **Format:** The final image should be a high-quality portrait suitable for official documents.
        7.  **Watermark:** Add a small, subtle 'TotthoAi' watermark in the bottom-right corner.

        User's photo to process:
        {{media url=photoDataUri}}`,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      
      if (!media?.url) {
          throw new Error('Image generation failed to produce a URL.');
      }

      return {imageUrl: media.url};
    } catch (error) {
       console.error("Error in passportPhotoMakerFlow:", error);
       if (error instanceof Error) {
         throw new Error(`Failed to generate passport photo: ${error.message}`);
       }
       throw new Error("An unknown error occurred during passport photo generation.");
    }
  }
);
