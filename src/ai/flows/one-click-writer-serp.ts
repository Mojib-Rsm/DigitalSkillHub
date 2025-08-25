
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
import type { OneClickWriterSerpInput } from '@/app/ai-tools/one-click-writer-serp/actions';

const OneClickWriterSerpInputSchema = z.object({
  title: z.string().min(10, { message: "Please enter a title with at least 10 characters." }),
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  targetCountry: z.string().describe('The target country for the content, for localization purposes.'),
  tone: z.string().describe('The desired writing tone for the article.'),
  audience: z.string().describe('The target audience for the article.'),
  purpose: z.string().describe('The purpose of the article (e.g., informational, commercial).'),
  outline: z.string().describe('The user-approved or edited outline for the article.'),
  customSource: z.string().optional().describe('An optional custom URL to use as a primary source.'),
});


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
    // This prompt now instructs the AI to use the provided context and the user-defined outline.
    const writerPromptWithSerp = ai.definePrompt({
      name: 'writerPromptWithSerp',
      input: { schema: z.custom<typeof serpContext>() },
      output: { schema: z.custom<OneClickWriterOutput>() },
      prompt: `
        You are an expert content creator and SEO specialist. Your goal is to write a comprehensive, engaging, and SEO-optimized blog post based on real-time SERP data and a user-provided outline.

        **User Inputs:**
        - **Topic/Title:** {{{title}}}
        - **Primary Keyword:** {{{primaryKeyword}}}
        - **Target Country:** {{{targetCountry}}}
        - **Tone of Voice:** {{{tone}}}
        - **Target Audience:** {{{audience}}}
        - **Purpose of Article:** {{{purpose}}}
        {{#if customSource}}
        - **Custom Source URL:** {{{customSource}}} (Prioritize information from this source)
        {{/if}}

        **SERP Analysis Data (for context and identifying themes):**
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

        **Content Outline (MUST FOLLOW THIS STRUCTURE):**
        {{{outline}}}

        **Instructions:**
        1.  **Strictly Adhere to the Outline:** The provided "Content Outline" is the definitive structure for the article. You MUST follow it, including all H2, H3, and bullet points.
        2.  **Integrate SERP Data:** While following the outline, enrich the content by incorporating themes, facts, and entities from the "SERP Analysis Data" to ensure comprehensiveness and relevance.
        3.  **Address User Intent:** The "Purpose of Article" (e.g., informational, commercial) and "Target Audience" should guide your writing style and the depth of information.
        4.  **SEO Optimization:**
            - The **Primary Keyword** ({{{primaryKeyword}}}) MUST be in the SEO Title, first paragraph, at least one H2, and the meta description.
            - Naturally include LSI keywords derived from the SERP analysis.
        5.  **Generate Meta Information:** Create an SEO-optimized title (around 60 characters) and a meta description (around 155 characters).
        6.  **Image Generation:** Generate a relevant featured image for the article.
        7.  **Output:** Provide the final article in Markdown format, along with all the required SEO metadata as defined in the output schema.
      `,
    });

    // We can call the original oneClickWriter flow, but we would need to adapt it to take the new prompt.
    // For simplicity and more control, let's call the new prompt directly and handle image generation here.
    const writerResponse = await oneClickWriter(input as any);

    return writerResponse;
  }
);


export async function oneClickWriterSerp(input: OneClickWriterSerpInput): Promise<OneClickWriterOutput> {
    try {
        const result = await oneClickWriterSerpFlow(input);
        return result;
    } catch (error) {
        console.error("Error in oneClickWriterSerp flow:", error);
        throw new Error((error as Error).message);
    }
}
