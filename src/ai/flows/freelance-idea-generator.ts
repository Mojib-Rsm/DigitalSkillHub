
'use server';

/**
 * @fileOverview AI tool to generate freelance project ideas based on user skills.
 *
 * - freelanceIdeaGenerator - A function that generates freelance ideas.
 * - FreelanceIdeaGeneratorInput - The input type for the freelanceIdeaGenerator function.
 * - FreelanceIdeaGeneratorOutput - The return type for the freelanceIdeaGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FreelanceIdeaGeneratorInputSchema = z.object({
  skills: z.string().describe('A comma-separated list of the user\'s skills.'),
});
export type FreelanceIdeaGeneratorInput = z.infer<typeof FreelanceIdeaGeneratorInputSchema>;

const FreelanceIdeaGeneratorOutputSchema = z.object({
  ideas: z.array(z.object({
    title: z.string().describe('The title of the freelance project idea.'),
    description: z.string().describe('A brief description of the project idea.'),
  })).describe('A list of freelance project ideas.'),
});
export type FreelanceIdeaGeneratorOutput = z.infer<typeof FreelanceIdeaGeneratorOutputSchema>;

export async function freelanceIdeaGenerator(input: FreelanceIdeaGeneratorInput): Promise<FreelanceIdeaGeneratorOutput> {
  return freelanceIdeaGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'freelanceIdeaGeneratorPrompt',
  input: {schema: FreelanceIdeaGeneratorInputSchema},
  output: {schema: FreelanceIdeaGeneratorOutputSchema},
  prompt: `You are a creative business consultant who helps people start freelancing.

Based on the user's skills, generate 5 specific and actionable freelance project ideas that they could start offering to clients. For each idea, provide a short description of what the service would entail.

User's Skills: {{{skills}}}`,
});

const freelanceIdeaGeneratorFlow = ai.defineFlow(
  {
    name: 'freelanceIdeaGeneratorFlow',
    inputSchema: FreelanceIdeaGeneratorInputSchema,
    outputSchema: FreelanceIdeaGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
