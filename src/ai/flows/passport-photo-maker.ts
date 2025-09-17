
'use server';

/**
 * @fileOverview AI tool to generate passport size photos and couple photos.
 *
 * - passportPhotoMaker - A function that generates a passport or couple photo.
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
      "A portrait photo of a person, as a data URI. Required for both single and couple photos."
    ),
   photoDataUri2: z
    .string()
    .optional()
    .describe(
      "A second portrait photo, for creating couple photos. Only used if couplePhoto is true."
    ),
  backgroundColor: z.enum(['White', 'Light Blue', 'Grey']).describe('The desired plain background color for the passport photo.'),
  couplePhoto: z.boolean().optional().describe("Set to true to generate a couple photo from two images.")
});
export type PassportPhotoMakerInput = z.infer<typeof PassportPhotoMakerInputSchema>;

const PassportPhotoMakerOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated passport or couple photo.'),
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
  async ({ photoDataUri, photoDataUri2, backgroundColor, couplePhoto }) => {
    try {
      
      let prompt;
      let modelInput: any[] = [];

      if (couplePhoto && photoDataUri2) {
        modelInput = [
            {media: {url: photoDataUri}},
            {media: {url: photoDataUri2}},
            {text: `You are an expert photo editor. Combine the two people from the two provided images into a single 'joint photo' or 'couple photo'. 
            
            Instructions:
            1.  Place the two individuals side-by-side, looking natural together.
            2.  Create a single, seamless, plain ${backgroundColor} background behind them.
            3.  Ensure the lighting and quality are consistent for both individuals.
            4.  Make minor adjustments to fix blurriness, spots, or improve overall quality to make them look good together.
            5.  The final image should be a high-quality portrait of the couple.
            6.  Add a small, subtle 'TotthoAi' watermark in the bottom-right corner.`
            },
        ];
      } else {
         modelInput = [
            {media: {url: photoDataUri}},
            {text: `You are an expert passport photo processor. Your task is to take the user's uploaded photo and generate a standard passport-size photo from it. Do NOT generate a new person or face. You must use the original image provided as a reference.

            Follow these instructions precisely:
            1.  **Face and Shoulders:** The output image must be a close-up of the person's head and shoulders from the original photo.
            2.  **Background:** The background must be a plain, uniform ${backgroundColor} background. There should be no shadows or patterns.
            3.  **Image Quality:** Automatically adjust brightness and contrast to make the photo clear and professional. Fix any blurriness and remove any minor spots or blemishes from the original photo to produce a clean and sharp final image.
            4.  **Expression:** The person should have a neutral facial expression with their eyes open and looking directly at the camera.
            5.  **Remove Obstructions:** Remove any hats, sunglasses, or non-religious head coverings from the person. Prescription glasses are acceptable but should not have glare. Remove any other objects covering the person.
            6.  **Format:** The final image should be a high-quality portrait suitable for official documents.
            7.  **Watermark:** Add a small, subtle 'TotthoAi' watermark in the bottom-right corner.`},
        ];
      }

      const {media} = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: modelInput,
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
       console.error("Error in passportPhotoMakerFlow:", error);
       if (error instanceof Error) {
         throw new Error(`Failed to generate photo: ${error.message}`);
       }
       throw new Error("An unknown error occurred during photo generation.");
    }
  }
);
