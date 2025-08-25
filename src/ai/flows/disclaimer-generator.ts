
'use server';

/**
 * @fileOverview AI tool to generate legal disclaimers.
 *
 * - disclaimerGenerator - A function that generates a disclaimer.
 * - DisclaimerGeneratorInput - The input type for the function.
 * - DisclaimerGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DisclaimerGeneratorInputSchema = z.object({
  companyName: z.string().describe('The name of the company or website.'),
  websiteUrl: z.string().url().describe('The URL of the website.'),
  disclaimerTypes: z.string().describe('A comma-separated list of the types of disclaimers needed (e.g., Affiliate, Testimonials, Informational).'),
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
  prompt: `You are an expert legal assistant. Generate a standard legal disclaimer for a website based on the following details.
  
Company Name: {{{companyName}}}
Website URL: {{{websiteUrl}}}
Disclaimer Types: {{{disclaimerTypes}}}

The disclaimer should be comprehensive, easy to read, and cover the specified types. Use clear headings.`,
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
