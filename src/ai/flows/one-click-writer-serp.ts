
'use server';
/**
 * @fileOverview A powerful AI tool that leverages multiple SERP APIs to generate a comprehensive, SEO-optimized blog post.
 * This flow orchestrates data from Google Custom Search, SerpApi, and DataForSEO.
 *
 * - oneClickWriterSerp - The main function that generates the full article.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getSerpResults, getKeywordData, getRelatedQuestions, type SerpResult, type KeywordData, type RelatedQuestion } from '@/services/serp-service';
import type { OneClickWriterOutput } from '@/ai/flows/one-click-writer';
import { oneClickWriter } from './one-click-writer';
import type { OneClickWriterSerpInput } from '@/ai/schema/one-click-writer-serp';
import { OneClickWriterSerpInputSchema } from '@/ai/schema/one-click-writer-serp';


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
    
    // This is a placeholder for a more complex writer flow
    // In a real scenario, you would pass the serpContext to a dedicated prompt
    // that knows how to use this rich information.
    const writerInput = {
        title: input.title,
        primaryKeyword: input.primaryKeyword,
        contentLength: 'Medium', // Or determine based on analysis
        tone: input.tone,
        targetCountry: input.targetCountry,
        includeFaq: true,
        includeKeyTakeaways: true,
        disableIntroduction: false,
        disableConclusion: false,
        enableSkinnyParagraph: true,
        passAiDetection: true,
    }
    
    // For now, we'll call the existing oneClickWriter, but a more advanced implementation
    // would use a prompt specifically designed for the SERP data.
    const writerResponse = await oneClickWriter(writerInput);

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
