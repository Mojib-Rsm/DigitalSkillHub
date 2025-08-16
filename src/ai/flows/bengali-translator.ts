
'use server';

/**
 * @fileOverview AI tool to translate content between English and Bengali.
 *
 * - bengaliTranslator - A function that translates text.
 * - BengaliTranslatorInput - The input type for the bengaliTranslator function.
 * - BengaliTranslatorOutput - The return type for the bengaliTranslator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BengaliTranslatorInputSchema = z.object({
  textToTranslate: z.string().describe('The text to be translated.'),
  targetLanguage: z.enum(['English', 'Bengali']).describe('The language to translate the text into.'),
});
export type BengaliTranslatorInput = z.infer<typeof BengaliTranslatorInputSchema>;

const BengaliTranslatorOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type BengaliTranslatorOutput = z.infer<typeof BengaliTranslatorOutputSchema>;

export async function bengaliTranslator(input: BengaliTranslatorInput): Promise<BengaliTranslatorOutput> {
  return bengaliTranslatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bengaliTranslatorPrompt',
  input: {schema: BengaliTranslatorInputSchema},
  output: {schema: BengaliTranslatorOutputSchema},
  prompt: `You are an expert translator.

Translate the following text to {{{targetLanguage}}}.

Text:
{{{textToTranslate}}}

Provide only the translated text as the output.`,
});

const bengaliTranslatorFlow = ai.defineFlow(
  {
    name: 'bengaliTranslatorFlow',
    inputSchema: BengaliTranslatorInputSchema,
    outputSchema: BengaliTranslatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
