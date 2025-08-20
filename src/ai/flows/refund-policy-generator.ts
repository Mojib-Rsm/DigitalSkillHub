
'use server';

/**
 * @fileOverview AI tool to generate refund policies.
 *
 * - refundPolicyGenerator - A function that generates a refund policy.
 * - RefundPolicyGeneratorInput - The input type for the function.
 * - RefundPolicyGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefundPolicyGeneratorInputSchema = z.object({
  companyName: z.string().describe('The name of the company or website.'),
  refundTimeframe: z.string().describe('The number of days within which a customer can request a refund (e.g., "14 days").'),
  productType: z.string().describe('The type of products or services sold (e.g., "digital products", "physical goods", "online courses").'),
  conditions: z.string().describe('Specific conditions for a refund (e.g., "product must be unused", "course completion less than 25%").'),
  contactEmail: z.string().email().describe('The email address for refund requests.'),
});
export type RefundPolicyGeneratorInput = z.infer<typeof RefundPolicyGeneratorInputSchema>;

const RefundPolicyGeneratorOutputSchema = z.object({
  policy: z.string().describe('The generated refund policy text.'),
});
export type RefundPolicyGeneratorOutput = z.infer<typeof RefundPolicyGeneratorOutputSchema>;

export async function refundPolicyGenerator(input: RefundPolicyGeneratorInput): Promise<RefundPolicyGeneratorOutput> {
  return refundPolicyGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refundPolicyGeneratorPrompt',
  input: {schema: RefundPolicyGeneratorInputSchema},
  output: {schema: RefundPolicyGeneratorOutputSchema},
  prompt: `You are an expert legal assistant skilled at drafting clear and fair refund policies.

Generate a standard Refund Policy for a website based on the following specific details. The policy should be easy for customers to understand and cover key aspects like how to request a refund, timelines, and conditions.

- Company Name: {{{companyName}}}
- Refund Timeframe: Customers can request a refund within {{{refundTimeframe}}}.
- Product/Service Type: The policy applies to {{{productType}}}.
- Refund Conditions: Key conditions for eligibility are: {{{conditions}}}.
- How to Request: Customers should email their refund request to {{{contactEmail}}}.

Please draft a comprehensive but easy-to-read refund policy incorporating all these points. Use clear headings for each section.`,
});

const refundPolicyGeneratorFlow = ai.defineFlow(
  {
    name: 'refundPolicyGeneratorFlow',
    inputSchema: RefundPolicyGeneratorInputSchema,
    outputSchema: RefundPolicyGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
