
'use server';

/**
 * @fileOverview AI tool to generate quizzes.
 *
 * - quizGenerator - A function that generates a quiz from text.
 * - QuizGeneratorInput - The input type for the quizGenerator function.
 * - QuizGeneratorOutput - The return type for the quizGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizGeneratorInputSchema = z.object({
  text: z.string().describe('The source text to generate the quiz from.'),
  numQuestions: z.number().min(1).max(10).describe('The number of questions to generate.'),
});
export type QuizGeneratorInput = z.infer<typeof QuizGeneratorInputSchema>;

const QuizGeneratorOutputSchema = z.object({
  questions: z.array(z.object({
    question: z.string().describe('The quiz question.'),
    options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
    answer: z.string().describe('The correct answer from the options.'),
  })).describe('A list of quiz questions.'),
});
export type QuizGeneratorOutput = z.infer<typeof QuizGeneratorOutputSchema>;

export async function quizGenerator(input: QuizGeneratorInput): Promise<QuizGeneratorOutput> {
  return quizGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'quizGeneratorPrompt',
  input: {schema: QuizGeneratorInputSchema},
  output: {schema: QuizGeneratorOutputSchema},
  prompt: `You are an expert at creating educational quizzes that are engaging and well-formulated.

Based on the following text, generate a multiple-choice quiz with {{{numQuestions}}} questions. Each question should have 4 options, and one correct answer. The questions and options should be clear, unambiguous, and sound like they were written by a human educator.

Text to analyze:
{{{text}}}
`,
});

const quizGeneratorFlow = ai.defineFlow(
  {
    name: 'quizGeneratorFlow',
    inputSchema: QuizGeneratorInputSchema,
    outputSchema: QuizGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
