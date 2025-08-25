
'use server';

/**
 * @fileOverview AI tool to generate Terms of Service.
 *
 * - termsOfServiceGenerator - A function that generates a ToS.
 * - TermsOfServiceGeneratorInput - The input type for the function.
 * - TermsOfServiceGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TermsOfServiceGeneratorInputSchema = z.object({
  companyName: z.string().describe('The name of the company or website.'),
  websiteUrl: z.string().url().describe('The URL of the website.'),
  country: z.string().describe('The country of jurisdiction.'),
  contactEmail: z.string().email().describe('The email address for legal inquiries.'),
});
export type TermsOfServiceGeneratorInput = z.infer<typeof TermsOfServiceGeneratorInputSchema>;

const TermsOfServiceGeneratorOutputSchema = z.object({
  terms: z.string().describe('The generated Terms of Service text.'),
});
export type TermsOfServiceGeneratorOutput = z.infer<typeof TermsOfServiceGeneratorOutputSchema>;

export async function termsOfServiceGenerator(input: TermsOfServiceGeneratorInput): Promise<TermsOfServiceGeneratorOutput> {
  return termsOfServiceGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'termsOfServiceGeneratorPrompt',
  input: {schema: TermsOfServiceGeneratorInputSchema},
  output: {schema: TermsOfServiceGeneratorOutputSchema},
  prompt: `You are an expert legal assistant. Generate a standard Terms of Service for a website based on the following details.
  
Company Name: {{{companyName}}}
Website URL: {{{websiteUrl}}}
Country of Jurisdiction: {{{country}}}
Contact Email: {{{contactEmail}}}

The terms should be comprehensive, easy to read, and cover key aspects like user responsibilities and prohibited activities. Use clear headings for each section.`,
});

const termsOfServiceGeneratorFlow = ai.defineFlow(
  {
    name: 'termsOfServiceGeneratorFlow',
    inputSchema: TermsOfServiceGeneratorInputSchema,
    outputSchema: TermsOfServiceGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
