
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
        throw new Error('Failed to fetch generated video.');
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
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: input.prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes. Note that this may take some time.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video || !video.media?.url) {
      throw new Error('Failed to find the generated video');
    }

    const videoDataUri = await downloadVideo(video as MediaPart);

    return { videoUrl: videoDataUri };
  }
);
