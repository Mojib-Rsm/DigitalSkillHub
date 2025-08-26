
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
  title: z.string().min(10, { message: "Please enter a title with at least 10 characters." }),
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  contentLength: z.enum(['Auto', 'Short', 'Medium', 'Long', 'Ultra Long']).describe('The desired length of the article (Short: 600-800, Medium: 900-1,600, Long: 1,700-3,000, Ultra Long: 3,000-6,000 words).'),
  tone: z.enum(['Formal', 'Casual', 'Friendly', 'Professional']).describe('The desired writing tone for the article.'),
  targetCountry: z.string().describe('The target country for the content, for localization purposes.'),
  includeFaq: z.boolean().optional().describe('Whether to include a FAQ section in the article.'),
  includeKeyTakeaways: z.boolean().optional().describe('Whether to include a key takeaways section.'),
  disableIntroduction: z.boolean().optional().describe('Whether to disable the introduction section.'),
  disableConclusion: z.boolean().optional().describe('Whether to disable the conclusion section.'),
  enableSkinnyParagraph: z.boolean().optional().describe('Whether to use short, "skinny" paragraphs for better readability.'),
  passAiDetection: z.boolean().optional().describe('Whether to use techniques to bypass AI detection tools.'),
});
export type OneClickWriterInput = z.infer<typeof OneClickWriterInputSchema>;

const OneClickWriterOutputSchema = z.object({
  article: z.string().describe('The full, well-structured article in Markdown format, with multiple H2/H3 headings.'),
  seoTitle: z.string().describe('An SEO-optimized title for the article.'),
  seoDescription: z.string().describe('A compelling meta description (around 155 characters) for SEO.'),
  featuredImageUrl: z.string().describe('A data URI of a relevant, high-quality featured image for the article.'),
  altText: z.string().describe('SEO-friendly alt text for the featured image.'),
  internalLinks: z.array(z.string()).describe('A list of 3-5 suggested topics for internal links within the article.'),
  externalLinks: z.array(z.string()).describe('A list of 2-3 suggested topics for external (reputable source) links.'),
  readability: z.object({
      score: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how easy the article is to read (100 being very easy).'),
      gradeLevel: z.string().describe("The Flesch-Kincaid grade level of the text."),
      interpretation: z.string().describe("A brief interpretation of the readability score."),
  }).describe("A detailed readability analysis."),
  seoAnalysis: z.object({
    sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe("The overall sentiment of the article."),
    wordCount: z.number().describe("The total word count of the article."),
    lsiKeywords: z.array(z.string()).describe("A list of 5-7 Latent Semantic Indexing (LSI) keywords found in the text."),
  }).describe("A premium SEO analysis of the content."),
  targetKeyword: z.string().describe('The primary keyword used for optimization.'),
  suggestedTags: z.array(z.string()).describe('A list of 5-7 relevant tags for the article.'),
  suggestedCategories: z.array(z.string()).describe('A list of 1-3 relevant categories for the article.'),
});
export type OneClickWriterOutput = z.infer<typeof OneClickWriterOutputSchema>;


const writerPrompt = ai.definePrompt({
    name: 'oneClickWriterPrompt',
    input: { schema: OneClickWriterInputSchema },
    output: { schema: z.object({
        article: z.string().describe("The full, well-structured article in Markdown format. It must include an engaging introduction, multiple subheadings (H2 using ##, H3 using ###), bold text using **, italics using *, and bullet points or lists where appropriate. Crucially, you MUST insert the text '[IN_ARTICLE_IMAGE_PLACEHOLDER]' at a relevant location within the article body where a secondary image would make sense. The content should be comprehensive and meet the specified length."),
        seoTitle: z.string().describe('An SEO-optimized title for the article (around 60 characters).'),
        seoDescription: z.string().describe('A compelling meta description (around 155 characters) for SEO.'),
        imagePrompt: z.string().describe('A descriptive prompt for an AI image generator to create a relevant featured image.'),
        inArticleImagePrompt: z.string().describe('A descriptive prompt for an AI image generator to create a relevant image to be placed within the article body.'),
        altText: z.string().describe('SEO-friendly alt text for the featured image, containing the primary keyword.'),
        internalLinks: z.array(z.string()).describe('A list of 3-5 relevant topics for internal links within the article, based on the content.'),
        externalLinks: z.array(z.string()).describe('A list of 2-3 relevant topics for external (reputable, non-competing) sources.'),
        readability: z.object({
            score: z.number().min(0).max(100).describe('A score from 0 to 100 indicating how easy the article is to read (100 being very easy).'),
            gradeLevel: z.string().describe("The Flesch-Kincaid grade level of the text."),
            interpretation: z.string().describe("A brief, one-sentence interpretation of what the score means (e.g., 'Easy to read for a general audience')."),
        }).describe("A detailed readability analysis."),
        seoAnalysis: z.object({
            sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe("The overall sentiment of the article."),
            wordCount: z.number().describe("The total word count of the generated article."),
            lsiKeywords: z.array(z.string()).describe("A list of 5-7 Latent Semantic Indexing (LSI) keywords that are contextually related to the main keyword."),
        }).describe("A premium SEO analysis of the content."),
        targetKeyword: z.string().describe('The primary keyword that was used for optimization.'),
        suggestedTags: z.array(z.string()).describe('A list of 5-7 relevant, specific tags for the article.'),
        suggestedCategories: z.array(z.string()).describe('A list of 1-3 relevant, broad categories for the article.'),
    })},
    prompt: `You are an expert content creator and SEO specialist who writes like a human, not a robot. Your primary goal is to generate a comprehensive, engaging, and SEO-optimized blog post that achieves a 100% SEO score and can bypass AI detectors. The article must be ready for publication.

    **User Inputs:**
    - **Topic/Title:** {{{title}}}
    - **Primary Keyword:** {{{primaryKeyword}}}
    - **Desired Length:** {{{contentLength}}} (Auto: Let AI decide, Short: 600-800 words, Medium: 900-1,600 words, Long: 1,700-3,000 words, Ultra Long: 3,000-6,000 words).
    - **Desired Tone:** {{{tone}}}
    - **Target Country:** {{{targetCountry}}}

    **Content Structure Options:**
    {{#if disableIntroduction}}- Do NOT include an introduction. Start directly with the main content.{{/if}}
    {{#if includeKeyTakeaways}}- Include a 'Key Takeaways' section near the beginning, summarizing the main points in a bulleted list.{{/if}}
    {{#if includeFaq}}- Include a detailed FAQ section at the end with 3-5 relevant questions and answers.{{/if}}
    {{#if disableConclusion}}- Do NOT include a conclusion. End the article after the last main point.{{/if}}
    {{#if enableSkinnyParagraph}}- Use "skinny paragraphs": keep most paragraphs very short (1-3 sentences) for high readability.{{/if}}

    **Instructions for 100% SEO Score & Human-like Writing:**

    1.  **Keyword Integration & Density:**
        *   The **Primary Keyword** ({{{primaryKeyword}}}) MUST be included naturally in the **SEO Title**, the first paragraph (introduction), at least one H2 subheading, and the meta description.
        *   Use the primary keyword and its synonyms throughout the body text with a density of about 1-2%. Avoid keyword stuffing.

    2.  **Content Structure & Formatting:**
        *   Write a well-structured article using proper Markdown.
        *   It MUST have multiple H2 (##) and H3 (###) subheadings to break up the text.
        *   Use **bold text** for emphasis on important terms. Use *italic text* for nuance. Use bullet points or numbered lists where appropriate.
        *   Adhere to the desired length. The article must be comprehensive and detailed.
        *   If the target country is not 'United States', subtly include context, examples, or references relevant to the '{{{targetCountry}}}'.
        *   **VERY IMPORTANT**: You must insert the exact text '[IN_ARTICLE_IMAGE_PLACEHOLDER]' in a relevant place within the article body where a secondary image would enhance the content.

    3.  **Human-like Tone & Style (Critical for Bypassing AI Detectors):**
        *   Adopt the specified **Tone** ({{{tone}}}).
        *   Use a mix of short, punchy sentences and longer, more complex ones to create a natural rhythm.
        *   Incorporate transition words (e.g., however, therefore, in addition) to ensure smooth flow between paragraphs.
        *   Avoid starting consecutive sentences with the same word.
        {{#if passAiDetection}}
        *   **CRITICAL:** To pass AI detection, you MUST avoid common AI clichés like "In today's digital age," "Furthermore," "It's important to note," "In conclusion," or "Overall." The conclusion should feel like a natural summary or a final thought, not a formal announcement. Use metaphors, analogies, or storytelling to make the content relatable.
        {{/if}}

    4.  **Meta Information Generation:**
        *   Generate a concise and catchy **SEO Title** (around 60 characters) that includes the primary keyword.
        *   Write a compelling **Meta Description** (around 155 characters) that includes the keyword and encourages clicks.

    5.  **Image & Linking Suggestions:**
        *   Create a detailed, descriptive **Image Prompt** for an AI image generator to create a high-quality, relevant featured image.
        *   Create a second, different, detailed **In-Article Image Prompt** for a relevant image to be placed within the article.
        *   Generate SEO-friendly **Alt Text** for the featured image that INCLUDES the primary keyword.
        *   Suggest 3-5 relevant topics for **Internal Links** (these are potential keyphrases from the article that could link to other articles on the same site).
        *   Suggest 2-3 relevant topics for **External Links** (links to reputable, non-competing sources to build authority).

    6. **Analysis & Metrics:**
        *   **Readability:** Analyze the generated text and provide a score from 0-100, the Flesch-Kincaid grade level, and a one-sentence interpretation.
        *   **SEO Analysis:** Determine the article's sentiment (Positive, Negative, Neutral), calculate the total word count, and list 5-7 LSI keywords.
    
    7.  **Taxonomy Suggestions:**
        *   Based on the article's content, suggest 1-3 broad **Categories**.
        *   Based on the article's content, suggest 5-7 specific **Tags**.

    8.  **Confirmation:**
        *   Confirm the **Target Keyword** used for optimization in the output. This MUST be the same as the user's primary keyword.

    The final output MUST be a complete JSON object following the schema. Ensure every field is populated correctly and the article is fully formatted in Markdown.
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
    const { article: rawArticle, seoTitle, seoDescription, imagePrompt, inArticleImagePrompt, altText, internalLinks, externalLinks, readability, seoAnalysis, targetKeyword, suggestedTags, suggestedCategories } = writerResponse.output!;

    // Generate both images in parallel, but handle failures gracefully
    const [featuredImageResult, inArticleImageResult] = await Promise.allSettled([
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: imagePrompt,
            config: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
        ai.generate({
            model: 'googleai/gemini-2.0-flash-preview-image-generation',
            prompt: inArticleImagePrompt,
            config: { responseModalities: ['TEXT', 'IMAGE'] },
        })
    ]);

    let featuredImageUrl = "https://placehold.co/1024x576.png"; // Default placeholder
    if (featuredImageResult.status === 'fulfilled' && featuredImageResult.value.media?.url) {
        featuredImageUrl = featuredImageResult.value.media.url;
    } else if (featuredImageResult.status === 'rejected') {
        console.warn("Featured image generation failed:", featuredImageResult.reason.message);
    }
    
    let inArticleImageUrl;
    if (inArticleImageResult.status === 'fulfilled' && inArticleImageResult.value.media?.url) {
        inArticleImageUrl = inArticleImageResult.value.media.url;
    } else if (inArticleImageResult.status === 'rejected') {
        console.warn("In-article image generation failed:", inArticleImageResult.reason.message);
    }
    
    // Replace the placeholder in the article with the second image's URL if available
    let finalArticle = rawArticle;
    if (inArticleImageUrl) {
        const inArticleImageMarkdown = `![${inArticleImagePrompt}](${inArticleImageUrl})`;
        finalArticle = rawArticle.replace('[IN_ARTICLE_IMAGE_PLACEHOLDER]', inArticleImageMarkdown);
    } else {
        // If the in-article image fails or is not generated, just remove the placeholder
        finalArticle = rawArticle.replace('[IN_ARTICLE_IMAGE_PLACEHOLDER]', '');
    }
    
    return {
        article: finalArticle,
        seoTitle,
        seoDescription,
        featuredImageUrl: featuredImageUrl,
        altText,
        internalLinks,
        externalLinks,
        readability,
        seoAnalysis,
        targetKeyword,
        suggestedTags,
        suggestedCategories,
    };
  }
);
