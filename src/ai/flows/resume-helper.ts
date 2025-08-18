
'use server';

/**
 * @fileOverview AI tool to help users write their resume/CV.
 *
 * - resumeHelper - A function that provides resume suggestions.
 * - ResumeHelperInput - The input type for the resumeHelper function.
 * - ResumeHelperOutput - The return type for the resumeHelper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeHelperInputSchema = z.object({
  jobTitle: z.string().describe('The job title the user is applying for.'),
  skills: z.string().describe('A comma-separated list of the user\'s skills.'),
  experience: z.string().describe('A description of the user\'s work experience.'),
});
export type ResumeHelperInput = z.infer<typeof ResumeHelperInputSchema>;

const ResumeHelperOutputSchema = z.object({
  suggestions: z.string().describe('Suggestions for improving the resume, including action verbs and phrasing.'),
});
export type ResumeHelperOutput = z.infer<typeof ResumeHelperOutputSchema>;

export async function resumeHelper(input: ResumeHelperInput): Promise<ResumeHelperOutput> {
  return resumeHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeHelperPrompt',
  input: {schema: ResumeHelperInputSchema},
  output: {schema: ResumeHelperOutputSchema},
  prompt: `You are a professional resume writer and career coach who provides actionable, human-centric advice.

Provide suggestions to improve a resume for the following job application. Focus on using strong action verbs and tailoring the content to the job title. The advice should be encouraging and sound like it's from a real coach, not an automated tool.

Job Title: {{{jobTitle}}}
Skills: {{{skills}}}
Work Experience: {{{experience}}}

Provide specific, constructive suggestions for bullet points and a summary statement that will make the resume stand out.`,
});

const resumeHelperFlow = ai.defineFlow(
  {
    name: 'resumeHelperFlow',
    inputSchema: ResumeHelperInputSchema,
    outputSchema: ResumeHelperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
