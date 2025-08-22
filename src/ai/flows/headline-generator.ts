
'use server';

/**
 * @fileOverview AI tool to generate headlines.
 *
 * - headlineGenerator - A function that generates headlines.
 * - HeadlineGeneratorInput - The input type for the function.
 * - HeadlineGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HeadlineGeneratorInputSchema = z.object({
  topic: z.string().describe('The topic of the content.'),
  contentType: z.string().describe('The type of content (e.g., Blog Post, YouTube Video, News Article).'),
  tone: z.string().describe('The desired tone (e.g., professional, clickbait, controversial, informative).'),
});
export type HeadlineGeneratorInput = z.infer<typeof HeadlineGeneratorInputSchema>;

const HeadlineGeneratorOutputSchema = z.object({
  headlines: z.array(z.string()).describe('A list of 5-7 suggested headlines.'),
});
export type HeadlineGeneratorOutput = z.infer<typeof HeadlineGeneratorOutputSchema>;

export async function headlineGenerator(input: HeadlineGeneratorInput): Promise<HeadlineGeneratorOutput> {
  return headlineGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'headlineGeneratorPrompt',
  input: {schema: HeadlineGeneratorInputSchema},
  output: {schema: HeadlineGeneratorOutputSchema},
  prompt: `You are an expert headline writer, a master of creating catchy, clickable, and SEO-friendly titles.

Generate a list of 5-7 compelling headlines based on the following details.

Topic: {{{topic}}}
Content Type: {{{contentType}}}
Desired Tone: {{{tone}}}

The headlines should be optimized for engagement and clicks, while accurately reflecting the content.`,
});

const headlineGeneratorFlow = ai.defineFlow(
  {
    name: 'headlineGeneratorFlow',
    inputSchema: HeadlineGeneratorInputSchema,
    outputSchema: HeadlineGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
