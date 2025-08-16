
'use server';

/**
 * @fileOverview AI tool to generate business names.
 *
 * - businessNameGenerator - A function that generates business names.
 * - BusinessNameGeneratorInput - The input type for the businessNameGenerator function.
 * - BusinessNameGeneratorOutput - The return type for the businessNameGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessNameGeneratorInputSchema = z.object({
  industry: z.string().describe('The industry or niche of the business.'),
  keywords: z.string().describe('Keywords related to the business or its values.'),
  style: z.string().describe('The desired style of the name (e.g., Modern, Traditional, Playful).'),
});
export type BusinessNameGeneratorInput = z.infer<typeof BusinessNameGeneratorInputSchema>;

const BusinessNameGeneratorOutputSchema = z.object({
  names: z.array(z.string()).describe('A list of suggested business names.'),
});
export type BusinessNameGeneratorOutput = z.infer<typeof BusinessNameGeneratorOutputSchema>;

export async function businessNameGenerator(input: BusinessNameGeneratorInput): Promise<BusinessNameGeneratorOutput> {
  return businessNameGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'businessNameGeneratorPrompt',
  input: {schema: BusinessNameGeneratorInputSchema},
  output: {schema: BusinessNameGeneratorOutputSchema},
  prompt: `You are a branding expert specializing in naming businesses.

Generate a list of 5 creative and memorable business names based on the following criteria.

Industry: {{{industry}}}
Keywords: {{{keywords}}}
Style: {{{style}}}

Provide a diverse list of names that are easy to pronounce and remember.`,
});

const businessNameGeneratorFlow = ai.defineFlow(
  {
    name: 'businessNameGeneratorFlow',
    inputSchema: BusinessNameGeneratorInputSchema,
    outputSchema: BusinessNameGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
