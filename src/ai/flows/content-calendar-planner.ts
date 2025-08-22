
'use server';

/**
 * @fileOverview AI tool to generate a content calendar.
 *
 * - contentCalendarPlanner - A function that generates a content plan.
 * - ContentCalendarPlannerInput - The input type for the function.
 * - ContentCalendarPlannerOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentCalendarPlannerInputSchema = z.object({
  topic: z.string().describe('The central theme or topic for the content calendar.'),
  platform: z.enum(['Blog', 'Social Media']).describe('The primary platform for the content.'),
  duration: z.string().describe('The duration for the calendar (e.g., 1 week, 1 month).'),
});
export type ContentCalendarPlannerInput = z.infer<typeof ContentCalendarPlannerInputSchema>;

const ContentCalendarPlannerOutputSchema = z.object({
  calendar: z.array(z.object({
    day: z.string().describe('The day for the post (e.g., Day 1, Monday).'),
    postTitle: z.string().describe('The title or main idea for the post.'),
    description: z.string().describe('A brief description or a few key points for the content.'),
    suggestedHashtags: z.string().optional().describe('A few suggested hashtags, if applicable.'),
  })).describe('A list of planned content posts.'),
});
export type ContentCalendarPlannerOutput = z.infer<typeof ContentCalendarPlannerOutputSchema>;

export async function contentCalendarPlanner(input: ContentCalendarPlannerInput): Promise<ContentCalendarPlannerOutput> {
  return contentCalendarPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentCalendarPlannerPrompt',
  input: {schema: ContentCalendarPlannerInputSchema},
  output: {schema: ContentCalendarPlannerOutputSchema},
  prompt: `You are an expert social media manager and content strategist. You excel at planning engaging content over a period of time.

Create a content calendar for the following requirements.

Topic/Theme: {{{topic}}}
Platform: {{{platform}}}
Duration: {{{duration}}}

Generate a structured content plan. For each entry, provide the day, a catchy post title or idea, a brief description of the content, and relevant hashtags (if for social media). Ensure the plan is cohesive and builds on the central theme over the specified duration.`,
});

const contentCalendarPlannerFlow = ai.defineFlow(
  {
    name: 'contentCalendarPlannerFlow',
    inputSchema: ContentCalendarPlannerInputSchema,
    outputSchema: ContentCalendarPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
