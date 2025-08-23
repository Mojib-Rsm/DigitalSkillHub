
'use server';

/**
 * @fileOverview AI tool to generate videos from an image and an optional text prompt.
 *
 * - imageToVideoGenerator - A function that generates a video.
 * - ImageToVideoGeneratorInput - The input type for the function.
 * - ImageToVideoGeneratorOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/googleai';
import type { MediaPart } from 'genkit';
import { Buffer } from 'buffer';

const ImageToVideoGeneratorInputSchema = z.object({
  prompt: z.string().optional().describe('The text prompt describing what should happen in the video. If not provided, a default animation will be attempted.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo to use as a reference for the video, as a data URI. It must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ImageToVideoGeneratorInput = z.infer<typeof ImageToVideoGeneratorInputSchema>;

const ImageToVideoGeneratorOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type ImageToVideoGeneratorOutput = z.infer<typeof ImageToVideoGeneratorOutputSchema>;

async function downloadVideo(video: MediaPart): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    
    // Correctly construct the video URL with the API key
    const videoUrl = video.media!.url!.includes('?') 
      ? `${video.media!.url}&key=${process.env.GEMINI_API_KEY}` 
      : `${video.media!.url}?key=${process.env.GEMINI_API_KEY}`;
      
    console.log(`Downloading video from: ${videoUrl.substring(0, 100)}...`);

    const videoDownloadResponse = await fetch(videoUrl);

    if (!videoDownloadResponse.ok) {
        const errorBody = await videoDownloadResponse.text();
        console.error('Failed to fetch video:', videoDownloadResponse.status, errorBody);
        throw new Error(`Failed to fetch generated video. Status: ${videoDownloadResponse.status}.`);
    }

    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString('base64');
    // Ensure we have a content type, default to mp4 if not present.
    const contentType = video.media!.contentType || 'video/mp4';
    
    return `data:${contentType};base64,${base64Video}`;
}

export async function imageToVideoGenerator(input: ImageToVideoGeneratorInput): Promise<ImageToVideoGeneratorOutput> {
  return imageToVideoGeneratorFlow(input);
}

const imageToVideoGeneratorFlow = ai.defineFlow(
  {
    name: 'imageToVideoGeneratorFlow',
    inputSchema: ImageToVideoGeneratorInputSchema,
    outputSchema: ImageToVideoGeneratorOutputSchema,
  },
  async ({ prompt, photoDataUri }) => {
    try {
        const match = photoDataUri.match(/^data:(image\/\w+);base64,(.*)$/);
        if (!match) {
            throw new Error("Invalid photoDataUri format. Expected 'data:<mimetype>;base64,<encoded_data>'.");
        }
        const [, mimeType, base64Data] = match;

        // Use a default prompt if none is provided
        const finalPrompt = prompt || 'animate this image';

        let { operation } = await ai.generate({
          model: googleAI.model('veo-3.0-generate-preview'),
          prompt: [
            { image: { bytesBase64Encoded: base64Data, mimeType: mimeType } },
            { text: finalPrompt },
          ],
        });

        if (!operation) {
          throw new Error('Expected the model to return an operation. Please try again after some time.');
        }

        while (!operation.done) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          operation = await ai.checkOperation(operation);
        }

        if (operation.error) {
          console.error("Video generation operation failed:", JSON.stringify(operation.error));
          throw new Error('Failed to generate video: ' + operation.error.message);
        }
        
        if (!operation.output?.message?.content) {
            console.error("Incomplete operation output:", JSON.stringify(operation));
            throw new Error("Video generation operation finished but did not produce the expected output format. Please try again after some time.");
        }

        const video = operation.output.message.content.find((p) => !!p.media);
        if (!video || !video.media?.url) {
          console.error("No video media found in operation output:", JSON.stringify(operation.output));
          throw new Error('Failed to find the generated video in the operation output. Please try again after some time.');
        }

        const videoDataUri = await downloadVideo(video as MediaPart);

        return { videoUrl: videoDataUri };
    } catch (error) {
        console.error("Error in imageToVideoGeneratorFlow:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
  }
);
