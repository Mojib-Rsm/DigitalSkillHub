'use server';

/**
 * @fileOverview AI tool to suggest relevant blog content topics based on trending digital skills and user interests.
 *
 * - blogTopicGenerator - A function that generates blog topics.
 * - BlogTopicGeneratorInput - The input type for the blogTopicGenerator function.
 * - BlogTopicGeneratorOutput - The return type for the blogTopicGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BlogTopicGeneratorInputSchema = z.object({
  digitalSkills: z
    .string()
    .describe(
      'A comma separated list of trending digital skills to consider, like: Web Development, Graphics Design, SEO, Digital Marketing, Freelancing, and AI Tools'
    ),
  userInterests: z.string().describe('A comma separated list of user interests.'),
});
export type BlogTopicGeneratorInput = z.infer<typeof BlogTopicGeneratorInputSchema>;

const BlogTopicGeneratorOutputSchema = z.object({
  topics: z.array(z.string()).describe('An array of suggested blog content topics.'),
});
export type BlogTopicGeneratorOutput = z.infer<typeof BlogTopicGeneratorOutputSchema>;

export async function blogTopicGenerator(input: BlogTopicGeneratorInput): Promise<BlogTopicGeneratorOutput> {
  return blogTopicGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'blogTopicGeneratorPrompt',
  input: {schema: BlogTopicGeneratorInputSchema},
  output: {schema: BlogTopicGeneratorOutputSchema},
  prompt: `You are a blog content topic generator expert.

You will suggest blog content topics based on trending digital skills and user interests.

Trending Digital Skills: {{{digitalSkills}}}
User Interests: {{{userInterests}}}

Suggest 5 blog content topics.`, 
});

const blogTopicGeneratorFlow = ai.defineFlow(
  {
    name: 'blogTopicGeneratorFlow',
    inputSchema: BlogTopicGeneratorInputSchema,
    outputSchema: BlogTopicGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
