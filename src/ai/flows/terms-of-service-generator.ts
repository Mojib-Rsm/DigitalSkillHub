
'use server';

/**
 * @fileOverview AI tool to generate Terms of Service documents.
 *
 * - termsOfServiceGenerator - A function that generates a Terms of Service document.
 * - TermsOfServiceGeneratorInput - The input type for the function.
 * - TermsOfServiceGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TermsOfServiceGeneratorInputSchema = z.object({
  companyName: z.string().describe('The name of the company or website.'),
  websiteUrl: z.string().url().describe('The full URL of the website.'),
  country: z.string().describe('The country where the company is based, for legal jurisdiction.'),
  contactEmail: z.string().email().describe('The email address for legal or support inquiries.'),
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
  prompt: `You are an expert legal assistant specializing in generating clear and comprehensive Terms of Service documents.

Generate a standard Terms of Service (ToS) document for a website based on the following details. The ToS should include essential clauses such as User Responsibilities, Prohibited Activities, Intellectual Property, Termination, Limitation of Liability, and Governing Law. The language should be professional and easy to understand.

Company Name: {{{companyName}}}
Website URL: {{{websiteUrl}}}
Governing Law & Jurisdiction (Country): {{{country}}}
Contact Email: {{{contactEmail}}}

Structure the document with clear, numbered headings for each major section.`,
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
