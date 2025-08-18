
'use server';

/**
 * @fileOverview AI tool to generate replies to Facebook comments.
 *
 * - facebookReplyGenerator - A function that generates replies.
 * - FacebookReplyGeneratorInput - The input type for the function.
 * - FacebookReplyGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FacebookReplyGeneratorInputSchema = z.object({
  postContent: z.string().describe('The content of the original Facebook post.'),
  commentToReply: z.string().describe('The specific comment that needs a reply.'),
  conversationHistory: z.string().optional().describe('The preceding conversation thread to provide context for the reply. This could include the user\'s original comment and the post author\'s reply.'),
});
export type FacebookReplyGeneratorInput = z.infer<typeof FacebookReplyGeneratorInputSchema>;

const FacebookReplyGeneratorOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3-5 suggested replies in Bengali.'),
});
export type FacebookReplyGeneratorOutput = z.infer<typeof FacebookReplyGeneratorOutputSchema>;

export async function facebookReplyGenerator(input: FacebookReplyGeneratorInput): Promise<FacebookReplyGeneratorOutput> {
  return facebookReplyGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facebookReplyGeneratorPrompt',
  input: {schema: FacebookReplyGeneratorInputSchema},
  output: {schema: FacebookReplyGeneratorOutputSchema},
  prompt: `You are an expert social media manager, skilled in crafting thoughtful and engaging replies in Bengali.

Your task is to generate 3 to 5 appropriate replies to a specific comment on a Facebook post. The replies should be relevant to the original post, the comment, and any provided conversation history. Maintain a positive and helpful tone.

Original Post Content:
{{{postContent}}}

{{#if conversationHistory}}
Here is the conversation history leading up to the comment we are replying to:
---
{{{conversationHistory}}}
---
{{/if}}

Comment to Reply To:
{{{commentToReply}}}

Based on the full context, generate a list of 3-5 suitable replies in Bengali. The replies should be directed at the person who wrote the "Comment to Reply To".`,
});

const facebookReplyGeneratorFlow = ai.defineFlow(
  {
    name: 'facebookReplyGeneratorFlow',
    inputSchema: FacebookReplyGeneratorInputSchema,
    outputSchema: FacebookReplyGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
