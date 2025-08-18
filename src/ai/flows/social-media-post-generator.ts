
'use server';

/**
 * @fileOverview AI tool to generate social media posts.
 *
 * - socialMediaPostGenerator - A function that generates social media posts.
 * - SocialMediaPostGeneratorInput - The input type for the socialMediaPostGenerator function.
 * - SocialMediaPostGeneratorOutput - The return type for the socialMediaPostGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SocialMediaPostGeneratorInputSchema = z.object({
  topic: z.string().describe('The topic of the social media post.'),
  platform: z.string().describe('The social media platform (e.g., Facebook, Instagram, Twitter).'),
  tone: z.string().describe('The desired tone of the post (e.g., Formal, Casual, Funny).'),
});
export type SocialMediaPostGeneratorInput = z.infer<typeof SocialMediaPostGeneratorInputSchema>;

const SocialMediaPostGeneratorOutputSchema = z.object({
  post: z.string().describe('The generated social media post.'),
});
export type SocialMediaPostGeneratorOutput = z.infer<typeof SocialMediaPostGeneratorOutputSchema>;

export async function socialMediaPostGenerator(input: SocialMediaPostGeneratorInput): Promise<SocialMediaPostGeneratorOutput> {
  return socialMediaPostGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'socialMediaPostGeneratorPrompt',
  input: {schema: SocialMediaPostGeneratorInputSchema},
  output: {schema: SocialMediaPostGeneratorOutputSchema},
  prompt: `You are a social media marketing expert known for creating posts with an authentic, human voice.

Generate a social media post based on the following information. The post should sound natural and conversational, not like it was written by an AI.

Topic: {{{topic}}}
Platform: {{{platform}}}
Tone: {{{tone}}}

The post should be engaging and appropriate for the specified platform. Include relevant hashtags that feel natural to the post.`,
});

const socialMediaPostGeneratorFlow = ai.defineFlow(
  {
    name: 'socialMediaPostGeneratorFlow',
    inputSchema: SocialMediaPostGeneratorInputSchema,
    outputSchema: SocialMediaPostGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
