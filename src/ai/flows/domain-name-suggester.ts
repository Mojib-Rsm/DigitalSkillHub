
'use server';

/**
 * @fileOverview AI tool to suggest domain names.
 *
 * - domainNameSuggester - A function that suggests domain names.
 * - DomainNameSuggesterInput - The input type for the domainNameSuggester function.
 * - DomainNameSuggesterOutput - The return type for the domainNameSuggester function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DomainNameSuggesterInputSchema = z.object({
  keywords: z.string().describe('Keywords related to the business or website.'),
  tlds: z.string().describe('A comma-separated list of preferred top-level domains (e.g., .com, .org, .net).'),
});
export type DomainNameSuggesterInput = z.infer<typeof DomainNameSuggesterInputSchema>;

const DomainNameSuggesterOutputSchema = z.object({
  domains: z.array(z.string()).describe('A list of suggested domain names.'),
});
export type DomainNameSuggesterOutput = z.infer<typeof DomainNameSuggesterOutputSchema>;

export async function domainNameSuggester(input: DomainNameSuggesterInput): Promise<DomainNameSuggesterOutput> {
  return domainNameSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'domainNameSuggesterPrompt',
  input: {schema: DomainNameSuggesterInputSchema},
  output: {schema: DomainNameSuggesterOutputSchema},
  prompt: `You are an expert at creating available and brandable domain names.

Generate a list of 5 creative and catchy domain names based on the following criteria. The suggested domains should be easy to remember and spell.

Keywords: {{{keywords}}}
Preferred TLDs: {{{tlds}}}

Suggest names that are likely to be available.`,
});

const domainNameSuggesterFlow = ai.defineFlow(
  {
    name: 'domainNameSuggesterFlow',
    inputSchema: DomainNameSuggesterInputSchema,
    outputSchema: DomainNameSuggesterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
