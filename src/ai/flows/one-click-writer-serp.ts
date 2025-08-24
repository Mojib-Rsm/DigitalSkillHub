
'use server';
/**
 * @fileOverview AI tool to generate a complete, SEO-optimized blog post from a single title, informed by SERP data.
 *
 * - oneClickWriterSerp - A function that generates a full article.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getSerpResults } from '@/services/serp-service';
import { OneClickWriterSerpInputSchema, OneClickWriterSerpOutputSchema, type OneClickWriterSerpInput, type OneClickWriterSerpOutput } from '@/ai/schema/one-click-writer-serp';


const serpAnalysisTool = ai.defineTool(
    {
        name: 'serpAnalysisTool',
        description: 'Get the top Google search results for a given query to understand the context and identify key topics to cover in an article.',
        inputSchema: z.object({
            query: z.string().describe("The search query to get SERP results for."),
        }),
        outputSchema: z.array(z.object({
            title: z.string(),
            link: z.string(),
            snippet: z.string(),
        })),
    },
    async (input) => {
        return getSerpResults(input.query);
    }
);


const writerPrompt = ai.definePrompt({
    name: 'oneClickWriterSerpPrompt',
    input: { schema: OneClickWriterSerpInputSchema },
    output: { schema: z.object({
        article: z.string().describe("The full, well-structured article in Markdown format. It must include an engaging introduction, multiple subheadings (H2 using ##, H3 using ###), bold text using **, and lists where appropriate. The content should be comprehensive, well-researched, and reflect insights from the provided SERP data."),
        seoTitle: z.string().describe('An SEO-optimized title for the article (around 60 characters).'),
        seoDescription: z.string().describe('A compelling meta description (around 155 characters) for SEO.'),
        imagePrompt: z.string().describe('A descriptive prompt for an AI image generator to create a relevant featured image.'),
        altText: z.string().describe('SEO-friendly alt text for the featured image, containing the primary keyword.'),
    })},
    tools: [serpAnalysisTool],
    prompt: `You are an expert content creator and SEO specialist. Your primary goal is to generate a comprehensive, engaging, and SEO-optimized blog post that is better than the current top-ranking articles on Google. The article must be ready for publication.

    **User Inputs:**
    - **Topic/Title:** {{{title}}}
    - **Primary Keyword:** {{{primaryKeyword}}}
    - **Language:** {{{language}}}
    - **Tone:** {{{tone}}}
    - **Target Country:** {{{targetCountry}}}

    **Instructions:**
    1. **SERP Analysis:** Use the 'serpAnalysisTool' with the '{{{primaryKeyword}}}' to analyze the top 10 Google search results. Understand the user intent, common questions, and key sub-topics covered by top competitors.
    2. **Content Generation:**
        *   Write a comprehensive article in **{{{language}}}** that covers the topic in-depth, addressing all key points found in the SERP analysis and adding unique value.
        *   The article must have a compelling introduction and a strong conclusion.
        *   Structure the content with multiple H2 (##) and H3 (###) subheadings. Use Markdown for formatting.
        *   Naturally integrate the **Primary Keyword** ({{{primaryKeyword}}}) in the SEO Title, meta description, introduction, and at least one H2 subheading. Maintain a keyword density of 1-2%.
        *   Adopt the specified **Tone** ({{{tone}}}).
        *   If the target country is not 'United States', subtly include context, examples, or references relevant to '{{{targetCountry}}}'.
    3. **Meta Information:**
        *   Generate a catchy, SEO-optimized **SEO Title** (around 60 characters).
        *   Write a compelling **Meta Description** (around 155 characters).
    4. **Image Prompt:**
        *   Create a detailed, descriptive **Image Prompt** for an AI image generator to create a high-quality featured image.
        *   Generate SEO-friendly **Alt Text** for the image that includes the primary keyword.

    The final output MUST be a complete JSON object following the schema.`,
});

export async function oneClickWriterSerp(input: OneClickWriterSerpInput): Promise<OneClickWriterSerpOutput> {
  const writerResponse = await writerPrompt(input);
  const { article, seoTitle, seoDescription, imagePrompt, altText } = writerResponse.output!;

  const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imagePrompt,
      config: { responseModalities: ['TEXT', 'IMAGE'] },
  });

  const featuredImageUrl = media?.url;
  if (!featuredImageUrl) {
      throw new Error("Failed to generate a featured image for the article.");
  }
  
  return {
      article,
      seoTitle,
      seoDescription,
      featuredImageUrl: featuredImageUrl,
      altText,
  };
}
