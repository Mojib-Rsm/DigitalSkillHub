
'use server';

/**
 * @fileOverview AI tool to generate ad copies.
 *
 * - adCopyGenerator - A function that generates ad copies.
 * - AdCopyGeneratorInput - The input type for the adCopyGenerator function.
 * - AdCopyGeneratorOutput - The return type for the adCopyGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdCopyGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product or service.'),
  productDescription: z.string().describe('A brief description of the product or service.'),
  targetAudience: z.string().describe('The target audience for the ad.'),
  platform: z.enum(['Facebook Ads', 'Google Ads']).describe('The platform where the ad will be shown.'),
});
export type AdCopyGeneratorInput = z.infer<typeof AdCopyGeneratorInputSchema>;

const AdCopyGeneratorOutputSchema = z.object({
  headlines: z.array(z.string()).describe('A list of 3-5 suggested headlines for the ad.'),
  body: z.string().describe('The main body text for the ad.'),
});
export type AdCopyGeneratorOutput = z.infer<typeof AdCopyGeneratorOutputSchema>;

export async function adCopyGenerator(input: AdCopyGeneratorInput): Promise<AdCopyGeneratorOutput> {
  return adCopyGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adCopyGeneratorPrompt',
  input: {schema: AdCopyGeneratorInputSchema},
  output: {schema: AdCopyGeneratorOutputSchema},
  prompt: `You are an expert copywriter specializing in high-converting ad copy. Your writing is persuasive, concise, and tailored to the platform.

Generate compelling ad copy for the following product/service.

Product/Service Name: {{{productName}}}
Description: {{{productDescription}}}
Target Audience: {{{targetAudience}}}
Platform: {{{platform}}}

Generate 3-5 catchy headlines and one primary ad body text that are optimized for the specified platform. Focus on benefits over features.`,
});

const adCopyGeneratorFlow = ai.defineFlow(
  {
    name: 'adCopyGeneratorFlow',
    inputSchema: AdCopyGeneratorInputSchema,
    outputSchema: AdCopyGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
