
"use server";

import { oneClickWriterSerp } from "@/ai/flows/one-click-writer-serp";
import { saveHistoryAction } from "@/app/actions/save-history";
import { getSerpResults, getKeywordData, getRelatedQuestions, SerpResult, KeywordData, RelatedQuestion } from '@/services/serp-service';
import { z } from "zod";
import type { OneClickWriterOutput } from "@/ai/flows/one-click-writer";
import { OneClickWriterSerpInputSchema, type OneClickWriterSerpInput } from "@/ai/schema/one-click-writer-serp";


const SerpAnalysisInputSchema = z.object({
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  targetCountry: z.string().min(2, { message: "Please select a target country." }),
});

export type SerpAnalysisResult = {
    serpResults: SerpResult[];
    keywordData: KeywordData;
    relatedQuestions: RelatedQuestion[];
}

export async function getSerpAnalysisAction(
  formData: FormData
): Promise<{ success: boolean; data?: SerpAnalysisResult; issues?: string[] }> {
    const validatedFields = SerpAnalysisInputSchema.safeParse({
        primaryKeyword: formData.get("primaryKeyword"),
        targetCountry: formData.get("targetCountry"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            issues: validatedFields.error.flatten().formErrors,
        };
    }

    try {
        const { primaryKeyword, targetCountry } = validatedFields.data;
        const [serpResults, keywordData, relatedQuestions] = await Promise.all([
            getSerpResults(primaryKeyword),
            getKeywordData(primaryKeyword, targetCountry),
            getRelatedQuestions(primaryKeyword)
        ]);

        if (serpResults.length === 0 && (!keywordData || (!keywordData.search_volume && !keywordData.cpc)) && relatedQuestions.length === 0) {
             return { success: false, issues: ["Could not fetch any SERP data. Please check your API keys and quotas in the setup guide."] };
        }


        return {
            success: true,
            data: {
                serpResults,
                keywordData,
                relatedQuestions
            }
        }
    } catch (error: any) {
        console.error("Error in getSerpAnalysisAction:", error.message);
        if (error.response?.data?.error?.message) {
             console.error(`Google Search API Error: ${error.response.data.error.message}`);
             return { success: false, issues: [`Google Search API Error: ${error.response.data.error.message}`] };
        }
        return {
            success: false,
            issues: ["An unknown error occurred while fetching SERP data."]
        }
    }
}

export async function generateArticleFromSerpAction(
  input: OneClickWriterSerpInput
): Promise<{ success: boolean; data?: OneClickWriterOutput; issues?: string[] }> {
  
  const validatedFields = OneClickWriterSerpInputSchema.safeParse(input);
   if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.flatten().formErrors,
    };
  }

  try {
    const result = await oneClickWriterSerp(validatedFields.data);
    if (result) {
        await saveHistoryAction({
            tool: 'one-click-writer-serp',
            input: validatedFields.data,
            output: result,
        });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["Failed to generate the article. Please try again."] }
    }
  } catch (error) {
    console.error("one-click-writer-serp error:", error);
    if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("503") || error.message.toLowerCase().includes('rate limit')) {
             return { success: false, issues: ["The service is currently overloaded with high demand. Please try again in a few moments."] };
        }
        return { success: false, issues: [`An unexpected error occurred: ${error.message}`] };
    }
    return {
      success: false,
      issues: ["An unexpected error occurred. Please try again."],
    };
  }
}
