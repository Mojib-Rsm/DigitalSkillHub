
'use server';

/**
 * @fileOverview AI tool to suggest SEO keywords.
 *
 * - seoKeywordSuggester - A function that suggests SEO keywords.
 * - SeoKeywordSuggesterInput - The input type for the seoKeywordSuggester function.
 * - SeoKeywordSuggesterOutput - The return type for the seoKeywordSuggester function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SeoKeywordSuggesterInputSchema = z.object({
  topic: z.string().describe('The main topic or niche for which to find keywords.'),
  targetAudience: z.string().describe('The target audience.'),
});
export type SeoKeywordSuggesterInput = z.infer<typeof SeoKeywordSuggesterInputSchema>;

const SeoKeywordSuggesterOutputSchema = z.object({
  keywords: z.array(z.string()).describe('A list of suggested SEO keywords, including long-tail keywords.'),
});
export type SeoKeywordSuggesterOutput = z.infer<typeof SeoKeywordSuggesterOutputSchema>;

export async function seoKeywordSuggester(input: SeoKeywordSuggesterInput): Promise<SeoKeywordSuggesterOutput> {
  return seoKeywordSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoKeywordSuggesterPrompt',
  input: {schema: SeoKeywordSuggesterInputSchema},
  output: {schema: SeoKeywordSuggesterOutputSchema},
  prompt: `You are an SEO specialist.

Suggest a list of 10-15 relevant SEO keywords for the given topic and target audience. Include a mix of short-tail and long-tail keywords.

Topic: {{{topic}}}
Target Audience: {{{targetAudience}}}`,
});

const seoKeywordSuggesterFlow = ai.defineFlow(
  {
    name: 'seoKeywordSuggesterFlow',
    inputSchema: SeoKeywordSuggesterInputSchema,
    outputSchema: SeoKeywordSuggesterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
