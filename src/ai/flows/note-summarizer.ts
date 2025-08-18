
'use server';

/**
 * @fileOverview AI tool to summarize text into notes.
 *
 * - noteSummarizer - A function that summarizes text.
 * - NoteSummarizerInput - The input type for the noteSummarizer function.
 * - NoteSummarizerOutput - The return type for the noteSummarizer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NoteSummarizerInputSchema = z.object({
  text: z.string().describe('The text to be summarized.'),
  format: z.enum(['bullet_points', 'paragraph']).describe('The desired format for the summary.'),
});
export type NoteSummarizerInput = z.infer<typeof NoteSummarizerInputSchema>;

const NoteSummarizerOutputSchema = z.object({
  summary: z.string().describe('The summarized text.'),
});
export type NoteSummarizerOutput = z.infer<typeof NoteSummarizerOutputSchema>;

export async function noteSummarizer(input: NoteSummarizerInput): Promise<NoteSummarizerOutput> {
  return noteSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'noteSummarizerPrompt',
  input: {schema: NoteSummarizerInputSchema},
  output: {schema: NoteSummarizerOutputSchema},
  prompt: `You are an expert at summarizing text and creating concise, human-readable notes. Your summaries should be clear, capture the key points, and be written in a natural style.

Summarize the following text into a clear and easy-to-understand format.

Format: {{{format}}}

Text to summarize:
{{{text}}}
`,
});

const noteSummarizerFlow = ai.defineFlow(
  {
    name: 'noteSummarizerFlow',
    inputSchema: NoteSummarizerInputSchema,
    outputSchema: NoteSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
