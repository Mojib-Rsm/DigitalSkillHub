
import { z } from 'zod';

export const OneClickWriterSerpInputSchema = z.object({
  title: z.string().min(10, { message: "Please enter a title with at least 10 characters." }),
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  targetCountry: z.string().describe('The target country for the content, for localization purposes.'),
  tone: z.string().describe('The desired writing tone for the article.'),
  audience: z.string().describe('The target audience for the article.'),
  purpose: z.string().describe('The purpose of the article (e.g., informational, commercial).'),
  outline: z.string().describe('The user-approved or edited outline for the article.'),
  customSource: z.string().optional().describe('An optional custom URL to use as a primary source.'),
});

export type OneClickWriterSerpInput = z.infer<typeof OneClickWriterSerpInputSchema>;
