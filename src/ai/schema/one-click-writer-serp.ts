import {z} from 'genkit';

export const OneClickWriterSerpInputSchema = z.object({
  title: z.string().min(10, { message: "Please enter a title with at least 10 characters." }),
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  language: z.enum(['Bengali', 'English']).describe('The desired language for the article.'),
  tone: z.enum(['Formal', 'Casual', 'Friendly', 'Professional']).describe('The desired writing tone for the article.'),
  targetCountry: z.string().describe('The target country for the content, for localization purposes.'),
});
export type OneClickWriterSerpInput = z.infer<typeof OneClickWriterSerpInputSchema>;

export const OneClickWriterSerpOutputSchema = z.object({
  article: z.string().describe('The full, well-structured article in Markdown format, with multiple H2/H3 headings.'),
  seoTitle: z.string().describe('An SEO-optimized title for the article.'),
  seoDescription: z.string().describe('A compelling meta description (around 155 characters) for SEO.'),
  featuredImageUrl: z.string().describe('A data URI of a relevant, high-quality featured image for the article.'),
  altText: z.string().describe('SEO-friendly alt text for the featured image.'),
});
export type OneClickWriterSerpOutput = z.infer<typeof OneClickWriterSerpOutputSchema>;
