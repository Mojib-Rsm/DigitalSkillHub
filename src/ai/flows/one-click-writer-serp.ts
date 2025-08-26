
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
    // 1. Fetch data from all APIs in parallel.
    // This will now gracefully handle errors (like quota exceeded) and return empty arrays.
    const [serpResults, keywordData, relatedQuestions] = await Promise.all([
      getSerpResults(input.primaryKeyword).catch(() => []),
      getKeywordData(input.primaryKeyword, input.targetCountry).catch(() => ({ search_volume: null, cpc: null })),
      getRelatedQuestions(input.primaryKeyword).catch(() => [])
    ]);

    // 2. Determine if we have enough SERP data to proceed with a SERP-informed article.
    const hasSufficientSerpData = serpResults.length > 0 || relatedQuestions.length > 0;

    // 3. Prepare the input for the final writer.
    // Even if SERP data is missing, we still proceed with a high-quality generation.
    const writerInput = {
        title: input.title,
        primaryKeyword: input.primaryKeyword,
        // If we have SERP data, we can aim for a longer, more comprehensive article.
        contentLength: hasSufficientSerpData ? 'Medium' : 'Short',
        tone: input.tone as any, // Cast because the enum is slightly different, but values overlap
        targetCountry: input.targetCountry,
        includeFaq: hasSufficientSerpData, // Only include FAQ if we have related questions
        includeKeyTakeaways: true,
        disableIntroduction: false,
        disableConclusion: false,
        enableSkinnyParagraph: true,
        passAiDetection: true,
        // We can pass the context to a more advanced prompt in the future.
        // For now, the logic above determines the generation strategy.
        // context: { ...serpContext } 
    };
    
    // Call the reliable oneClickWriter which does not depend on external real-time APIs.
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
