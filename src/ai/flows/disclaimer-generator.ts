
'use server';

/**
 * @fileOverview AI tool to generate legal disclaimers.
 *
 * - disclaimerGenerator - A function that generates a legal disclaimer.
 * - DisclaimerGeneratorInput - The input type for the function.
 * - DisclaimerGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisclaimerGeneratorInputSchema = z.object({
  companyName: z.string().describe('The name of the company or website.'),
  websiteUrl: z.string().url().describe('The full URL of the website.'),
  disclaimerTypes: z.string().describe('A comma-separated list of the types of disclaimers needed (e.g., Affiliate, Testimonials, Informational, Medical, Legal).'),
});
export type DisclaimerGeneratorInput = z.infer<typeof DisclaimerGeneratorInputSchema>;

const DisclaimerGeneratorOutputSchema = z.object({
  disclaimer: z.string().describe('The generated disclaimer text.'),
});
export type DisclaimerGeneratorOutput = z.infer<typeof DisclaimerGeneratorOutputSchema>;

export async function disclaimerGenerator(input: DisclaimerGeneratorInput): Promise<DisclaimerGeneratorOutput> {
  return disclaimerGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'disclaimerGeneratorPrompt',
  input: {schema: DisclaimerGeneratorInputSchema},
  output: {schema: DisclaimerGeneratorOutputSchema},
  prompt: `You are an expert legal assistant skilled at drafting specific and clear legal disclaimers.

Generate a set of legal disclaimers for a website based on the following details. Combine them into a single, well-structured document.

Website Name: {{{companyName}}}
Website URL: {{{websiteUrl}}}
Types of Disclaimers to Include: {{{disclaimerTypes}}}

For each disclaimer type requested, generate a concise and clear paragraph. The final output should be a single text block with appropriate headings for each disclaimer type. The tone should be professional and protective.`,
});

const disclaimerGeneratorFlow = ai.defineFlow(
  {
    name: 'disclaimerGeneratorFlow',
    inputSchema: DisclaimerGeneratorInputSchema,
    outputSchema: DisclaimerGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
