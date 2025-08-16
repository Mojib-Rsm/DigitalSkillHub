
'use server';

/**
 * @fileOverview A simple chatbot that answers questions about the Digital Skill Hub.
 *
 * - chatbot - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe("The conversation history."),
  message: z.string().describe("The user's latest message."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  reply: z.string().describe('The chatbot\'s reply in Bengali.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `You are a friendly and helpful chatbot for an online learning platform called "Digital Skill Hub".
Your purpose is to assist users, particularly women, youth, and people with disabilities in Bangladesh.
Your primary language for communication is Bengali.

You should be able to answer basic questions about the platform, such as:
- How to register
- How to enroll in a course
- What courses are available
- Information about the "Made in Cox's Bazar" marketplace

Here is the conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User's new message:
{{{message}}}

Provide a helpful and concise response in Bengali.`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    
