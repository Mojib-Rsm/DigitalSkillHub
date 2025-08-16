
'use server';

/**
 * @fileOverview AI tool to generate practice interview questions.
 *
 * - interviewQuestionPractice - A function that generates interview questions.
 * - InterviewQuestionPracticeInput - The input type for the interviewQuestionPractice function.
 * - InterviewQuestionPracticeOutput - The return type for the interviewQuestionPractice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterviewQuestionPracticeInputSchema = z.object({
  jobTitle: z.string().describe('The job title for which to generate questions.'),
  experienceLevel: z.string().describe('The candidate\'s experience level (e.g., Entry-Level, Mid-Level, Senior).'),
});
export type InterviewQuestionPracticeInput = z.infer<typeof InterviewQuestionPracticeInputSchema>;

const InterviewQuestionPracticeOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of practice interview questions.'),
});
export type InterviewQuestionPracticeOutput = z.infer<typeof InterviewQuestionPracticeOutputSchema>;

export async function interviewQuestionPractice(input: InterviewQuestionPracticeInput): Promise<InterviewQuestionPracticeOutput> {
  return interviewQuestionPracticeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interviewQuestionPracticePrompt',
  input: {schema: InterviewQuestionPracticeInputSchema},
  output: {schema: InterviewQuestionPracticeOutputSchema},
  prompt: `You are an experienced hiring manager.

Generate a list of 5 common interview questions for the following role. Include a mix of behavioral and technical questions appropriate for the experience level.

Job Title: {{{jobTitle}}}
Experience Level: {{{experienceLevel}}}`,
});

const interviewQuestionPracticeFlow = ai.defineFlow(
  {
    name: 'interviewQuestionPracticeFlow',
    inputSchema: InterviewQuestionPracticeInputSchema,
    outputSchema: InterviewQuestionPracticeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

