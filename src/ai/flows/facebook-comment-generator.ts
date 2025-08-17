
'use server';

/**
 * @fileOverview AI tool to generate Facebook comments and replies.
 *
 * - facebookCommentGenerator - A function that generates comments/replies.
 * - FacebookCommentGeneratorInput - The input type for the function.
 * - FacebookCommentGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FacebookCommentGeneratorInputSchema = z.object({
  postContent: z.string().describe('The content of the Facebook post to comment on.'),
  goal: z.string().describe('The user\'s goal for the comment (e.g., "Write a supportive comment", "Ask a question", "Reply to a customer complaint").'),
});
export type FacebookCommentGeneratorInput = z.infer<typeof FacebookCommentGeneratorInputSchema>;

const FacebookCommentGeneratorOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3-5 suggested comments or replies.'),
});
export type FacebookCommentGeneratorOutput = z.infer<typeof FacebookCommentGeneratorOutputSchema>;

export async function facebookCommentGenerator(input: FacebookCommentGeneratorInput): Promise<FacebookCommentGeneratorOutput> {
  return facebookCommentGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facebookCommentGeneratorPrompt',
  input: {schema: FacebookCommentGeneratorInputSchema},
  output: {schema: FacebookCommentGeneratorOutputSchema},
  prompt: `You are an expert social media manager specializing in engaging Facebook communication.

Generate a list of 3-5 appropriate comments or replies based on the following information. The tone should be suitable for Facebook and match the user's goal.

Facebook Post Content:
{{{postContent}}}

User's Goal:
{{{goal}}}

Provide helpful, concise, and engaging suggestions.`,
});

const facebookCommentGeneratorFlow = ai.defineFlow(
  {
    name: 'facebookCommentGeneratorFlow',
    inputSchema: FacebookCommentGeneratorInputSchema,
    outputSchema: FacebookCommentGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
