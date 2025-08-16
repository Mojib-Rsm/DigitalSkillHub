
'use server';

/**
 * @fileOverview AI tool to recommend courses.
 *
 * - courseRecommender - A function that recommends courses based on user interests.
 * - CourseRecommenderInput - The input type for the courseRecommender function.
 * - CourseRecommenderOutput - The return type for the courseRecommender function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CourseRecommenderInputSchema = z.object({
  interests: z.string().describe('A comma-separated list of the user\'s interests or desired skills.'),
});
export type CourseRecommenderInput = z.infer<typeof CourseRecommenderInputSchema>;

const CourseRecommenderOutputSchema = z.object({
  recommendations: z.array(z.object({
    courseName: z.string().describe('The name of the recommended course.'),
    reason: z.string().describe('A brief reason why this course is recommended.'),
  })).describe('A list of course recommendations.'),
});
export type CourseRecommenderOutput = z.infer<typeof CourseRecommenderOutputSchema>;

export async function courseRecommender(input: CourseRecommenderInput): Promise<CourseRecommenderOutput> {
  return courseRecommenderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'courseRecommenderPrompt',
  input: {schema: CourseRecommenderInputSchema},
  output: {schema: CourseRecommenderOutputSchema},
  prompt: `You are a helpful academic advisor for the "Digital Skill Hub" online learning platform.

Your goal is to recommend relevant courses to users based on their interests.
Here is the list of available courses: "Digital Literacy Basics", "Freelancing Basics in Bangla", "E-commerce Setup", "Home-based Skills (Handicraft, Food Business, Tailoring)", "Assistive Tech Training".

Based on the user's interests, recommend 3 courses and provide a short reason for each recommendation.

User's Interests: {{{interests}}}
`,
});

const courseRecommenderFlow = ai.defineFlow(
  {
    name: 'courseRecommenderFlow',
    inputSchema: CourseRecommenderInputSchema,
    outputSchema: CourseRecommenderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
