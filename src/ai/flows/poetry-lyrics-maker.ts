
'use server';

/**
 * @fileOverview AI tool to generate poetry and song lyrics.
 *
 * - poetryLyricsMaker - A function that generates poetry or lyrics.
 * - PoetryLyricsMakerInput - The input type for the function.
 * - PoetryLyricsMakerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PoetryLyricsMakerInputSchema = z.object({
  topic: z.string().describe('The main topic or theme.'),
  type: z.enum(['Poem', 'Song Lyrics']).describe('Whether to generate a poem or song lyrics.'),
  mood: z.string().describe('The desired mood (e.g., happy, melancholic, romantic).'),
  keywords: z.string().describe('A comma-separated list of keywords to include.'),
});
export type PoetryLyricsMakerInput = z.infer<typeof PoetryLyricsMakerInputSchema>;

const PoetryLyricsMakerOutputSchema = z.object({
  title: z.string().describe('A suggested title.'),
  content: z.string().describe('The generated poem or song lyrics.'),
});
export type PoetryLyricsMakerOutput = z.infer<typeof PoetryLyricsMakerOutputSchema>;

export async function poetryLyricsMaker(input: PoetryLyricsMakerInput): Promise<PoetryLyricsMakerOutput> {
  return poetryLyricsMakerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'poetryLyricsMakerPrompt',
  input: {schema: PoetryLyricsMakerInputSchema},
  output: {schema: PoetryLyricsMakerOutputSchema},
  prompt: `You are a gifted poet and songwriter, with a deep understanding of rhythm, rhyme, and metaphor.

Create a {{{type}}} based on the following details.

Topic: {{{topic}}}
Mood: {{{mood}}}
Keywords to include: {{{keywords}}}

Generate a fitting title and the full text of the poem or song lyrics. If generating lyrics, structure it with verses, a chorus, and a bridge.`,
});

const poetryLyricsMakerFlow = ai.defineFlow(
  {
    name: 'poetryLyricsMakerFlow',
    inputSchema: PoetryLyricsMakerInputSchema,
    outputSchema: PoetryLyricsMakerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
