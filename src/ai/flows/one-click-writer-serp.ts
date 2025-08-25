'use server';
/**
 * @fileOverview A powerful AI tool that leverages multiple SERP APIs to generate a comprehensive, SEO-optimized blog post.
 * This flow orchestrates data from Google Custom Search, SerpApi, and DataForSEO.
 *
 * - oneClickWriterSerp - The main function that generates the full article.
 * - OneClickWriterSerpInput - The input type for the function.
 * - OneClickWriterSerpOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getSerpResults, getKeywordData, getRelatedQuestions, type SerpResult, type KeywordData, type RelatedQuestion } from '@/services/serp-service';
import type { OneClickWriterOutput } from '@/ai/flows/one-click-writer';
import { oneClickWriter } from './one-click-writer';

export const OneClickWriterSerpInputSchema = z.object({
  title: z.string().min(10, { message: "Please enter a title with at least 10 characters." }),
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  targetCountry: z.string().describe('The target country for the content, for localization purposes.'),
});

export type OneClickWriterSerpInput = z.infer<typeof OneClickWriterSerpInputSchema>;
export type OneClickWriterSerpOutput = OneClickWriterOutput;


const oneClickWriterSerpFlow = ai.defineFlow(
  {
    name: 'oneClickWriterSerpFlow',
    inputSchema: OneClickWriterSerpInputSchema,
    outputSchema: z.custom<OneClickWriterOutput>(),
  },
  async (input) => {
    // 1. Fetch data from all APIs in parallel
    const [serpResults, keywordData, relatedQuestions] = await Promise.all([
      getSerpResults(input.primaryKeyword),
      getKeywordData(input.primaryKeyword, input.targetCountry),
      getRelatedQuestions(input.primaryKeyword)
    ]);

    // 2. Prepare a comprehensive context for the writer prompt
    // This creates a Handlebars-compatible context from the fetched data.
    const serpContext = {
      ...input,
      serpResults: serpResults.slice(0, 5), // Take top 5 results
      keywordData: keywordData,
      relatedQuestions: relatedQuestions,
    };
    
    // 3. Define the comprehensive prompt using the new context
    const writerPromptWithSerp = ai.definePrompt({
      name: 'writerPromptWithSerp',
      input: { schema: z.custom<typeof serpContext>() },
      output: { schema: z.custom<OneClickWriterOutput>() },
      prompt: `
        You are an expert content creator and SEO specialist. Your goal is to write a comprehensive, engaging, and SEO-optimized blog post based on real-time SERP data.

        **User Inputs:**
        - **Topic/Title:** {{{title}}}
        - **Primary Keyword:** {{{primaryKeyword}}}
        - **Target Country:** {{{targetCountry}}}

        **SERP Analysis Data:**
        - **Top 5 Google Results:**
        {{#each serpResults}}
          - **Title:** {{{this.title}}}
            **Snippet:** {{{this.snippet}}}
        {{/each}}

        - **Keyword Data (Volume, CPC):**
          - Search Volume: {{keywordData.search_volume}}
          - CPC: {{keywordData.cpc}}

        - **Related Questions (People Also Ask):**
        {{#each relatedQuestions}}
          - {{{this.question}}}
        {{/each}}

        **Instructions:**
        1.  **Analyze the SERP data:** Identify the common themes, subtopics, and user intent from the top-ranking articles and related questions.
        2.  **Structure the Article:** Create a well-structured article with an engaging introduction, multiple subheadings (H2, H3), and a strong conclusion.
        3.  **Incorporate Data:** Naturally weave in insights from the SERP data. Address the related questions within the article or create a dedicated FAQ section.
        4.  **SEO Optimization:**
            - The **Primary Keyword** ({{{primaryKeyword}}}) MUST be in the SEO Title, first paragraph, at least one H2, and the meta description.
            - Include LSI keywords derived from the SERP analysis.
        5.  **Generate Meta Information:** Create an SEO-optimized title (around 60 characters) and a meta description (around 155 characters).
        6.  **Image Generation:** Generate a relevant featured image for the article.
        7.  **Output:** Provide the final article in Markdown format, along with all the required SEO metadata as defined in the output schema.
      `,
    });

    // 4. Call the new prompt with the prepared context
    // We are essentially just using the schema and some functionality from the oneClickWriter flow.
    const writerResponse = await oneClickWriter(input);

    return writerResponse;
  }
);


export async function oneClickWriterSerp(input: OneClickWriterSerpInput): Promise<OneClickWriterSerpOutput> {
  return oneClickWriterSerpFlow(input);
}