
'use server';

/**
 * @fileOverview AI tool to calculate suggested pricing for freelance projects.
 *
 * - priceRateCalculator - A function that calculates a price range.
 * - PriceRateCalculatorInput - The input type for the priceRateCalculator function.
 * - PriceRateCalculatorOutput - The return type for the priceRateCalculator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PriceRateCalculatorInputSchema = z.object({
  projectType: z.string().describe('The type of freelance project (e.g., Logo Design, Blog Post Writing).'),
  complexity: z.enum(['Low', 'Medium', 'High']).describe('The complexity level of the project.'),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Expert']).describe('The freelancer\'s experience level.'),
});
export type PriceRateCalculatorInput = z.infer<typeof PriceRateCalculatorInputSchema>;

const PriceRateCalculatorOutputSchema = z.object({
  priceRange: z.string().describe('A suggested price range for the project (e.g., $50 - $100).'),
  justification: z.string().describe('A brief justification for the suggested price range, explaining the factors considered.'),
});
export type PriceRateCalculatorOutput = z.infer<typeof PriceRateCalculatorOutputSchema>;

export async function priceRateCalculator(input: PriceRateCalculatorInput): Promise<PriceRateCalculatorOutput> {
  return priceRateCalculatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'priceRateCalculatorPrompt',
  input: {schema: PriceRateCalculatorInputSchema},
  output: {schema: PriceRateCalculatorOutputSchema},
  prompt: `You are an expert freelance consultant who helps freelancers price their services effectively.

Based on the following project details, provide a suggested price range and a brief justification. The currency should be in USD. Consider the project type, complexity, and the freelancer's experience level.

Project Type: {{{projectType}}}
Complexity: {{{complexity}}}
Experience Level: {{{experienceLevel}}}

Provide a realistic price range and a short explanation of your reasoning.`,
});

const priceRateCalculatorFlow = ai.defineFlow(
  {
    name: 'priceRateCalculatorFlow',
    inputSchema: PriceRateCalculatorInputSchema,
    outputSchema: PriceRateCalculatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
