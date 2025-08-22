
'use server';

/**
 * @fileOverview AI tool to generate story plots.
 *
 * - storyPlotGenerator - A function that generates a story plot.
 * - StoryPlotGeneratorInput - The input type for the function.
 * - StoryPlotGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StoryPlotGeneratorInputSchema = z.object({
  genre: z.string().describe('The genre of the story (e.g., Sci-Fi, Fantasy, Mystery).'),
  premise: z.string().describe('A one-sentence premise or core idea for the story.'),
  keyElements: z.string().describe('A comma-separated list of key elements or characters to include.'),
});
export type StoryPlotGeneratorInput = z.infer<typeof StoryPlotGeneratorInputSchema>;

const StoryPlotGeneratorOutputSchema = z.object({
  title: z.string().describe('A suggested title for the story.'),
  logline: z.string().describe('A one or two-sentence summary of the story.'),
  plotOutline: z.string().describe('A structured plot outline (e.g., Act 1, Act 2, Act 3).'),
});
export type StoryPlotGeneratorOutput = z.infer<typeof StoryPlotGeneratorOutputSchema>;

export async function storyPlotGenerator(input: StoryPlotGeneratorInput): Promise<StoryPlotGeneratorOutput> {
  return storyPlotGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyPlotGeneratorPrompt',
  input: {schema: StoryPlotGeneratorInputSchema},
  output: {schema: StoryPlotGeneratorOutputSchema},
  prompt: `You are a master storyteller and plot developer. You can take a simple idea and flesh it out into a compelling narrative structure.

Generate a story plot based on the following details.

Genre: {{{genre}}}
Premise: {{{premise}}}
Key Elements to Include: {{{keyElements}}}

Develop a suggested title, a captivating logline, and a clear plot outline (e.g., using a three-act structure). The outline should detail the main plot points, character arcs, and potential conflicts.`,
});

const storyPlotGeneratorFlow = ai.defineFlow(
  {
    name: 'storyPlotGeneratorFlow',
    inputSchema: StoryPlotGeneratorInputSchema,
    outputSchema: StoryPlotGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
