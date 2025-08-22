
'use server';

/**
 * @fileOverview AI tool to generate a complete, SEO-optimized blog post from a single title.
 *
 * - oneClickWriter - A function that generates a full article.
 * - OneClickWriterInput - The input type for the function.
 * - OneClickWriterOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OneClickWriterInputSchema = z.object({
  title: z.string().describe('The title of the blog post to generate.'),
});
export type OneClickWriterInput = z.infer<typeof OneClickWriterInputSchema>;

const OneClickWriterOutputSchema = z.object({
  article: z.string().describe('The full, well-structured article in Markdown format.'),
  seoTitle: z.string().describe('An SEO-optimized title for the article.'),
  seoDescription: z.string().describe('A compelling meta description for SEO.'),
  featuredImageUrl: z.string().describe('A data URI of a relevant, high-quality featured image for the article.'),
});
export type OneClickWriterOutput = z.infer<typeof OneClickWriterOutputSchema>;


const writerPrompt = ai.definePrompt({
    name: 'oneClickWriterPrompt',
    input: { schema: OneClickWriterInputSchema },
    output: { schema: z.object({
        article: z.string().describe('The full, well-structured article in Markdown format.'),
        seoTitle: z.string().describe('An SEO-optimized title for the article.'),
        seoDescription: z.string().describe('A compelling meta description for SEO.'),
        imagePrompt: z.string().describe('A descriptive prompt for DALL-E to generate a relevant featured image.'),
    })},
    prompt: `You are an expert content creator and SEO specialist. Your task is to write a comprehensive, engaging, and SEO-optimized blog post based on the provided title.

    Title: {{{title}}}

    Instructions:
    1.  **Write the Article:** Create a well-structured article of at least 800 words. Use headings, subheadings, bullet points, and bold text to improve readability. The tone should be authoritative yet accessible. Ensure the content is informative and provides real value to the reader.
    2.  **SEO Optimization:**
        *   Generate a concise and catchy SEO Title (around 60 characters).
        *   Write a compelling meta description (around 155 characters) that encourages clicks.
    3.  **Image Prompt:** Create a detailed, descriptive prompt for an AI image generator (like DALL-E 3) to create a high-quality, relevant featured image for the article. The prompt should describe the scene, style, and mood.
    `,
});

export async function oneClickWriter(input: OneClickWriterInput): Promise<OneClickWriterOutput> {
  return oneClickWriterFlow(input);
}


const oneClickWriterFlow = ai.defineFlow(
  {
    name: 'oneClickWriterFlow',
    inputSchema: OneClickWriterInputSchema,
    outputSchema: OneClickWriterOutputSchema,
  },
  async (input) => {
    const writerResponse = await writerPrompt(input);
    const { article, seoTitle, seoDescription, imagePrompt } = writerResponse.output!;

    const imageGenResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: imagePrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const imageUrl = imageGenResponse.media?.url;
    if (!imageUrl) {
        throw new Error("Failed to generate a featured image for the article.");
    }
    
    return {
        article,
        seoTitle,
        seoDescription,
        featuredImageUrl: imageUrl
    };
  }
);
