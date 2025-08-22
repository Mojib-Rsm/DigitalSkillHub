
'use server';

/**
 * @fileOverview AI tool to generate content outlines.
 *
 * - contentOutlineGenerator - A function that generates an outline.
 * - ContentOutlineGeneratorInput - The input type for the function.
 * - ContentOutlineGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentOutlineGeneratorInputSchema = z.object({
  topic: z.string().describe('The main topic for the content.'),
  contentType: z.string().describe('The type of content (e.g., Blog Post, YouTube Video, Presentation).'),
});
export type ContentOutlineGeneratorInput = z.infer<typeof ContentOutlineGeneratorInputSchema>;

const ContentOutlineGeneratorOutputSchema = z.object({
  outline: z.array(z.object({
    section: z.string().describe('The name of the main section or heading.'),
    points: z.array(z.string()).describe('A list of bullet points or sub-topics for that section.'),
  })).describe('A structured outline for the content.'),
});
export type ContentOutlineGeneratorOutput = z.infer<typeof ContentOutlineGeneratorOutputSchema>;

export async function contentOutlineGenerator(input: ContentOutlineGeneratorInput): Promise<ContentOutlineGeneratorOutput> {
  return contentOutlineGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentOutlineGeneratorPrompt',
  input: {schema: ContentOutlineGeneratorInputSchema},
  output: {schema: ContentOutlineGeneratorOutputSchema},
  prompt: `You are an expert content strategist who creates logical and comprehensive outlines.

Generate a detailed content outline for the following topic and content type. The outline should be well-structured with clear main sections and detailed bullet points under each section.

Topic: {{{topic}}}
Content Type: {{{contentType}}}

Create an outline that flows logically from introduction to conclusion.`,
});

const contentOutlineGeneratorFlow = ai.defineFlow(
  {
    name: 'contentOutlineGeneratorFlow',
    inputSchema: ContentOutlineGeneratorInputSchema,
    outputSchema: ContentOutlineGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
