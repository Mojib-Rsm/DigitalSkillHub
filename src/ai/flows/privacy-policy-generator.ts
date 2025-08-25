
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
  websiteUrl: z.string().url().describe('The URL of the website.'),
  dataCollected: z.string().describe('A comma-separated list of the types of data collected (e.g., names, emails, cookies).'),
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
  prompt: `You are an expert legal assistant. Generate a standard privacy policy for a website based on the following details.
  
Company Name: {{{companyName}}}
Website URL: {{{websiteUrl}}}
Data Collected: {{{dataCollected}}}
Contact Email: {{{contactEmail}}}

The policy should be comprehensive, easy to read, and cover key aspects like GDPR. Use clear headings for each section.`,
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
