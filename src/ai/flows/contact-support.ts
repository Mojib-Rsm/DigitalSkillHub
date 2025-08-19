
'use server';

/**
 * @fileOverview AI flow to handle contact support requests.
 *
 * - contactSupportFlow - A function that generates an initial AI response.
 * - ContactSupportInput - The input type for the function.
 * - ContactSupportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContactSupportInputSchema = z.object({
  name: z.string().describe('The name of the person contacting support.'),
  email: z.string().email().describe('The email address of the person.'),
  subject: z.string().describe('The subject of the support request.'),
  message: z.string().describe('The detailed message from the user.'),
});
export type ContactSupportInput = z.infer<typeof ContactSupportInputSchema>;

const ContactSupportOutputSchema = z.object({
  reply: z.string().describe('A helpful, empathetic initial response to the user.'),
});
export type ContactSupportOutput = z.infer<typeof ContactSupportOutputSchema>;

export async function contactSupportFlow(input: ContactSupportInput): Promise<ContactSupportOutput> {
  return generateInitialReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contactSupportPrompt',
  input: {schema: ContactSupportInputSchema},
  output: {schema: ContactSupportOutputSchema},
  prompt: `You are a friendly and empathetic AI Support Agent for "TotthoAi".

A user has submitted a support request. Your task is to provide an initial, helpful, and reassuring response.

1.  **Acknowledge the User:** Address the user by their name ({{{name}}}).
2.  **Confirm Receipt:** Confirm that their message about "{{{subject}}}" has been received.
3.  **Provide Assurance:** Let them know that the team will review their message and get back to them.
4.  **Offer Initial Help (if possible):** Based on their message, provide a brief, general suggestion or point them to a relevant resource if applicable (like the FAQ or a specific tool).
5.  **Keep it Concise:** The response should be a short paragraph.

User's Message:
{{{message}}}

Generate a response that sounds human and caring, not robotic.`,
});

const generateInitialReplyFlow = ai.defineFlow(
  {
    name: 'generateInitialReplyFlow',
    inputSchema: ContactSupportInputSchema,
    outputSchema: ContactSupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
