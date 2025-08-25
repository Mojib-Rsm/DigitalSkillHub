
'use server';

/**
 * @fileOverview AI tool to handle contact form submissions.
 *
 * - contactSupportFlow - A function that processes the contact request.
 * - ContactSupportInput - The input type for the function.
 * - ContactSupportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ContactSupportInputSchema = z.object({
  name: z.string().describe('The user\'s name.'),
  email: z.string().email().describe('The user\'s email address.'),
  subject: z.string().describe('The subject of the message.'),
  message: z.string().describe('The user\'s message.'),
});
export type ContactSupportInput = z.infer<typeof ContactSupportInputSchema>;

export const ContactSupportOutputSchema = z.object({
  reply: z.string().describe('A confirmation or initial automated reply to the user.'),
});
export type ContactSupportOutput = z.infer<typeof ContactSupportOutputSchema>;

export async function contactSupportFlow(input: ContactSupportInput): Promise<ContactSupportOutput> {
    const prompt = ai.definePrompt({
        name: 'contactSupportPrompt',
        input: { schema: ContactSupportInputSchema },
        output: { schema: ContactSupportOutputSchema },
        prompt: `A user named {{{name}}} ({{{email}}}) has submitted a contact request with the subject "{{{subject}}}".
        
        Their message is:
        "{{{message}}}"

        Generate a friendly, initial automated response in Bengali acknowledging receipt of their message and assuring them that a human will respond shortly.
        Keep the reply concise. Address the user by their name.`,
    });

    const { output } = await prompt(input);
    return output!;
}
