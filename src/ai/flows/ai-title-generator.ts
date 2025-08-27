'use server';

/**
 * @fileOverview AI tool to generate catchy, SEO-friendly titles.
 *
 * - aiTitleGenerator - A function that generates titles.
 * - AiTitleGeneratorInput - The input type for the function.
 * - AiTitleGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTitleGeneratorInputSchema = z.object({
  primaryKeyword: z.string().describe('The primary keyword for the article.'),
  targetCountry: z.string().describe('The target country for localization.'),
});
export type AiTitleGeneratorInput = z.infer<typeof AiTitleGeneratorInputSchema>;

const AiTitleGeneratorOutputSchema = z.object({
  titles: z.array(z.string()).describe('A list of 5-7 suggested titles.'),
});
export type AiTitleGeneratorOutput = z.infer<typeof AiTitleGeneratorOutputSchema>;

export async function aiTitleGenerator(input: AiTitleGeneratorInput): Promise<AiTitleGeneratorOutput> {
  return aiTitleGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTitleGeneratorPrompt',
  input: {schema: AiTitleGeneratorInputSchema},
  output: {schema: AiTitleGeneratorOutputSchema},
  prompt: `You are an expert copywriter specializing in creating viral, SEO-friendly headlines.

Generate a list of 5-7 compelling and catchy titles for a blog post based on the following criteria.

Primary Keyword: {{{primaryKeyword}}}
Target Country: {{{targetCountry}}}

The titles should be engaging, clickable, and optimized for search engines. Ensure a variety of styles (e.g., listicles, questions, how-to guides).`,
});

const aiTitleGeneratorFlow = ai.defineFlow(
  {
    name: 'aiTitleGeneratorFlow',
    inputSchema: AiTitleGeneratorInputSchema,
    outputSchema: AiTitleGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
