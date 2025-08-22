
'use server';

/**
 * @fileOverview AI tool to check the SEO score of a given text content.
 *
 * - seoScoreChecker - A function that analyzes content for SEO.
 * - SeoScoreCheckerInput - The input type for the seoScoreChecker function.
 * - SeoScoreCheckerOutput - The return type for the seoScoreChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SeoScoreCheckerInputSchema = z.object({
  content: z.string().describe('The full text content of the article or page to be analyzed.'),
  keyword: z.string().describe('The primary target keyword for the content.'),
});
type SeoScoreCheckerInput = z.infer<typeof SeoScoreCheckerInputSchema>;

const SeoScoreCheckerOutputSchema = z.object({
    score: z.number().min(0).max(100).describe('The overall SEO score from 0 to 100.'),
    recommendations: z.array(z.string()).describe('A list of actionable recommendations to improve the SEO score.')
});
export type SeoScoreCheckerOutput = z.infer<typeof SeoScoreCheckerOutputSchema>;

export async function seoScoreChecker(input: SeoScoreCheckerInput): Promise<SeoScoreCheckerOutput> {
  return seoScoreCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoScoreCheckerPrompt',
  input: {schema: SeoScoreCheckerInputSchema},
  output: {schema: SeoScoreCheckerOutputSchema},
  prompt: `You are an expert SEO analyst. Your task is to analyze the provided text content based on a target keyword and provide an SEO score out of 100, along with actionable recommendations.

Target Keyword: {{{keyword}}}
Content to Analyze:
{{{content}}}

Analyze the following factors:
1.  **Keyword Density:** Is the keyword used appropriately (not too much, not too little)?
2.  **Title/Heading Presence:** Does the content seem to have a main title or heading that includes the keyword?
3.  **Content Structure:** Is the content well-structured with paragraphs?
4.  **Readability:** Is the content easy to read and understand?
5.  **Relevance:** How relevant is the content to the target keyword?

Based on your analysis, provide a score from 0 to 100.
Then, provide a list of 3-5 clear, concise, and actionable recommendations for improvement. The recommendations should be specific and easy for a non-expert to understand.`,
});

const seoScoreCheckerFlow = ai.defineFlow(
  {
    name: 'seoScoreCheckerFlow',
    inputSchema: SeoScoreCheckerInputSchema,
    outputSchema: SeoScoreCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
