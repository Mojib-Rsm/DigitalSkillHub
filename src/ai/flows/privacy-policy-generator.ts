
'use server';

/**
 * @fileOverview AI tool to generate privacy policies.
 *
 * - privacyPolicyGenerator - A function that generates a privacy policy.
 * - PrivacyPolicyGeneratorInput - The input type for the function.
 * - PrivacyPolicyGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrivacyPolicyGeneratorInputSchema = z.object({
  companyName: z.string().describe('The name of the company or website.'),
  websiteUrl: z.string().url().describe('The full URL of the website.'),
  dataCollected: z.string().describe('A comma-separated list of the types of data collected (e.g., names, emails, cookies, analytics data).'),
  contactEmail: z.string().email().describe('The email address for privacy-related inquiries.'),
});
export type PrivacyPolicyGeneratorInput = z.infer<typeof PrivacyPolicyGeneratorInputSchema>;

const PrivacyPolicyGeneratorOutputSchema = z.object({
  policy: z.string().describe('The generated privacy policy text.'),
});
export type PrivacyPolicyGeneratorOutput = z.infer<typeof PrivacyPolicyGeneratorOutputSchema>;

export async function privacyPolicyGenerator(input: PrivacyPolicyGeneratorInput): Promise<PrivacyPolicyGeneratorOutput> {
  return privacyPolicyGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'privacyPolicyGeneratorPrompt',
  input: {schema: PrivacyPolicyGeneratorInputSchema},
  output: {schema: PrivacyPolicyGeneratorOutputSchema},
  prompt: `You are an expert legal assistant specializing in generating comprehensive and human-readable privacy policies.

Generate a standard privacy policy for a website based on the following details. The policy should be clear, well-structured, and cover essential clauses like Data Collection, Use of Data, Data Protection, Cookies, and User Rights. The tone should be professional and trustworthy.

Company Name: {{{companyName}}}
Website URL: {{{websiteUrl}}}
Data Collected: {{{dataCollected}}}
Contact Email for Privacy Concerns: {{{contactEmail}}}

Structure the policy with clear headings and paragraphs. Ensure it is easy for a non-lawyer to understand.`,
});

const privacyPolicyGeneratorFlow = ai.defineFlow(
  {
    name: 'privacyPolicyGeneratorFlow',
    inputSchema: PrivacyPolicyGeneratorInputSchema,
    outputSchema: PrivacyPolicyGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
