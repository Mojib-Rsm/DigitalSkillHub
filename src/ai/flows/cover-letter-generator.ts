
'use server';

/**
 * @fileOverview AI tool to generate professional cover letters.
 *
 * - coverLetterGenerator - A function that generates cover letters.
 * - CoverLetterGeneratorInput - The input type for the coverLetterGenerator function.
 * - CoverLetterGeneratorOutput - The return type for the coverLetterGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CoverLetterGeneratorInputSchema = z.object({
  jobTitle: z.string().describe('The job title the user is applying for.'),
  companyName: z.string().describe('The name of the company.'),
  userSkills: z.string().describe('A comma-separated list of the user\'s relevant skills.'),
  userExperience: z.string().describe('A brief summary of the user\'s relevant experience.'),
});
export type CoverLetterGeneratorInput = z.infer<typeof CoverLetterGeneratorInputSchema>;

const CoverLetterGeneratorOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text.'),
});
export type CoverLetterGeneratorOutput = z.infer<typeof CoverLetterGeneratorOutputSchema>;

export async function coverLetterGenerator(input: CoverLetterGeneratorInput): Promise<CoverLetterGeneratorOutput> {
  return coverLetterGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coverLetterGeneratorPrompt',
  input: {schema: CoverLetterGeneratorInputSchema},
  output: {schema: CoverLetterGeneratorOutputSchema},
  prompt: `You are an expert career coach who writes compelling and human-sounding cover letters. Your writing style is natural, confident, and avoids robotic clichés.

Generate a professional and concise cover letter based on the following details. The tone should be enthusiastic and professional. The letter should highlight how the user's skills and experience naturally align with the job, telling a brief story rather than just listing facts.

Job Title: {{{jobTitle}}}
Company: {{{companyName}}}
User's Skills: {{{userSkills}}}
User's Experience: {{{userExperience}}}

Address the letter to "Hiring Manager" and keep it to 3-4 short paragraphs. Ensure the final output sounds like it was written by a real, passionate person.`,
});

const coverLetterGeneratorFlow = ai.defineFlow(
  {
    name: 'coverLetterGeneratorFlow',
    inputSchema: CoverLetterGeneratorInputSchema,
    outputSchema: CoverLetterGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
