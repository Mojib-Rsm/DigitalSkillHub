
'use server';

/**
 * @fileOverview AI tool to generate replies to Messenger conversations.
 *
 * - messengerReplyGenerator - A function that generates replies.
 * - MessengerReplyGeneratorInput - The input type for the function.
 * - MessengerReplyGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessengerReplyGeneratorInputSchema = z.object({
  conversation: z.array(z.object({
    character: z.string().describe("The character speaking (e.g., 'Friend', 'Me')."),
    text: z.string().describe("The text of their message."),
  })).optional().describe('The sequence of the conversation.'),
  goal: z.string().optional().describe("The user's goal for the reply (e.g., 'be supportive', 'end the conversation politely', 'ask a clarifying question')."),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional screenshot from the conversation, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type MessengerReplyGeneratorInput = z.infer<typeof MessengerReplyGeneratorInputSchema>;

const MessengerReplyGeneratorOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of 3-5 suggested replies in Bengali.'),
});
export type MessengerReplyGeneratorOutput = z.infer<typeof MessengerReplyGeneratorOutputSchema>;

export async function messengerReplyGenerator(input: MessengerReplyGeneratorInput): Promise<MessengerReplyGeneratorOutput> {
  return messengerReplyGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'messengerReplyGeneratorPrompt',
  input: {schema: MessengerReplyGeneratorInputSchema},
  output: {schema: MessengerReplyGeneratorOutputSchema},
  prompt: `You are an expert social media manager, skilled in crafting thoughtful, natural, and engaging replies in Bengali for Messenger. Your responses should never sound robotic; they must have a human touch.

Your task is to generate 3 to 5 appropriate replies for the character "Me" based on the context provided.

{{#if photoDataUri}}
A screenshot of the conversation is provided. Analyze the image, including the sender, receiver, and text content, to understand the context and generate relevant replies for "Me".
{{media url=photoDataUri}}
{{/if}}

{{#if conversation}}
Here is the conversation history:
---
{{#each conversation}}
{{character}}: {{{text}}}
{{/each}}
---
The replies should be relevant to the entire conversation history.
{{/if}}

{{#if goal}}
My Goal for the Reply:
My primary objective for this reply is to "{{{goal}}}". Please craft the suggestions to meet this specific goal while staying consistent with the context and sounding completely human.
{{else}}
Generate a list of 3-5 general, suitable, human-sounding replies in Bengali for "Me".
{{/if}}

Based on the full context (text and/or image), generate a list of 3-5 suitable, human-sounding replies in Bengali for "Me".`,
});

const messengerReplyGeneratorFlow = ai.defineFlow(
  {
    name: 'messengerReplyGeneratorFlow',
    inputSchema: MessengerReplyGeneratorInputSchema,
    outputSchema: MessengerReplyGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
