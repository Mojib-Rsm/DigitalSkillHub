
'use server';

/**
 * @fileOverview AI tool to generate videos from text prompts.
 *
 * - videoGenerator - A function that generates a video.
 * - VideoGeneratorInput - The input type for the videoGenerator function.
 * - VideoGeneratorOutput - The return type for the videoGenerator function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import type { MediaPart } from 'genkit';
import { Buffer } from 'buffer';


const VideoGeneratorInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a video from.'),
});
export type VideoGeneratorInput = z.infer<typeof VideoGeneratorInputSchema>;

const VideoGeneratorOutputSchema = z.object({
  videoUrl: z.string().describe('The data URI of the generated video.'),
});
export type VideoGeneratorOutput = z.infer<typeof VideoGeneratorOutputSchema>;

async function downloadVideo(video: MediaPart): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    // Add API key before fetching the video.
    const videoUrl = video.media!.url!.includes('?') ? `${video.media!.url}&key=${process.env.GEMINI_API_KEY}` : `${video.media!.url}?key=${process.env.GEMINI_API_KEY}`;
    const videoDownloadResponse = await fetch(videoUrl);

    if (!videoDownloadResponse || videoDownloadResponse.status !== 200 || !videoDownloadResponse.body) {
        const errorBody = await videoDownloadResponse.text();
        console.error('Failed to fetch video:', videoDownloadResponse.status, errorBody);
        throw new Error(`Failed to fetch generated video. Status: ${videoDownloadResponse.status}. Body: ${errorBody}`);
    }

    const videoBuffer = await videoDownloadResponse.arrayBuffer();
    const base64Video = Buffer.from(videoBuffer).toString('base64');
    const contentType = video.media!.contentType || 'video/mp4';
    
    return `data:${contentType};base64,${base64Video}`;
}


export async function videoGenerator(input: VideoGeneratorInput): Promise<VideoGeneratorOutput> {
  return videoGeneratorFlow(input);
}

const videoGeneratorFlow = ai.defineFlow(
  {
    name: 'videoGeneratorFlow',
    inputSchema: VideoGeneratorInputSchema,
    outputSchema: VideoGeneratorOutputSchema,
  },
  async (input) => {
    try {
        let { operation } = await ai.generate({
          model: googleAI.model('veo-3.0-generate-preview'),
          prompt: input.prompt,
        });

        if (!operation) {
          throw new Error('Expected the model to return an operation');
        }

        // Wait until the operation completes. Note that this may take some time.
        while (!operation.done) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          operation = await ai.checkOperation(operation);
        }

        if (operation.error) {
          throw new Error('failed to generate video: ' + operation.error.message);
        }
        
        // Add robust checking for the operation output.
        if (!operation.output?.message?.content) {
            console.error("Incomplete operation output:", JSON.stringify(operation));
            throw new Error("Video generation operation finished but did not produce the expected output format.");
        }

        const video = operation.output.message.content.find((p) => !!p.media);
        if (!video || !video.media?.url) {
          console.error("No video media found in operation output:", JSON.stringify(operation.output));
          throw new Error('Failed to find the generated video in the operation output.');
        }

        const videoDataUri = await downloadVideo(video as MediaPart);

        return { videoUrl: videoDataUri };
    } catch (error) {
        console.error("Error in videoGeneratorFlow:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate video: ${error.message}`);
        }
        throw new Error("An unknown error occurred during video generation.");
    }
  }
);
