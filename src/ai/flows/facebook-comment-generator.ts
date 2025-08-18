
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
  goal: z.string().optional().describe('The user\'s goal for the comment (e.g., "Write a supportive comment", "Ask a question", "Reply to a customer complaint"). This is optional.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo from the post, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FacebookCommentGeneratorInput = z.infer<typeof FacebookCommentGeneratorInputSchema>;

const FacebookCommentGeneratorOutputSchema = z.object({
  bengaliSuggestions: z.array(z.string()).describe('A list of 3-5 suggested comments or replies in Bengali.'),
  englishSuggestions: z.array(z.string()).describe('A list of 3-5 suggested comments or replies in English.'),
});
export type FacebookCommentGeneratorOutput = z.infer<typeof FacebookCommentGeneratorOutputSchema>;

export async function facebookCommentGenerator(input: FacebookCommentGeneratorInput): Promise<FacebookCommentGeneratorOutput> {
  return facebookCommentGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facebookCommentGeneratorPrompt',
  input: {schema: FacebookCommentGeneratorInputSchema},
  output: {schema: FacebookCommentGeneratorOutputSchema},
  prompt: `You are an expert social media manager specializing in engaging, human-like Facebook communication. Your replies should sound natural, authentic, and never robotic.

Generate lists of appropriate comments, replies, or captions based on the following information.

Facebook Post Content:
{{{postContent}}}

{{#if photoDataUri}}
The post also includes this image:
{{media url=photoDataUri}}
Analyze the image content, including any text within it, as part of the post's context. Your primary goal is to generate captions or relevant comments based on the image.
You MUST provide two lists of suggestions: one in Bengali and one in English. Generate 3-5 suggestions for each language.
{{/if}}

{{#if goal}}
User's Goal:
{{{goal}}}
Based on this goal, generate comments that sound like a real person would write them.
{{else}}
The user has not specified a goal. Generate general, engaging comments that are relevant to the post content and image (if provided). Make them sound authentic and conversational.
{{/if}}

{{#unless photoDataUri}}
If no image is provided, your primary goal is to generate comments or replies based on the 'postContent'. You should generate a single list of suggestions in Bengali and return it in the 'bengaliSuggestions' field. The 'englishSuggestions' field should be an empty array.
{{/unless}}


Provide helpful, concise, and engaging suggestions suitable for Facebook. The tone should be human and natural.`,
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
