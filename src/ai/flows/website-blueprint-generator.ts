
'use server';

/**
 * @fileOverview AI tool to generate a website blueprint from an idea.
 *
 * - websiteBlueprintGenerator - A function that generates a website plan.
 * - WebsiteBlueprintInput - The input type for the function.
 * - WebsiteBlueprintOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WebsiteBlueprintInputSchema = z.object({
  websiteType: z.string().describe('The type of website to be built.'),
  targetAudience: z.string().describe('The primary target audience for the website.'),
  coreFeatures: z.array(z.string()).describe('A list of must-have features.'),
  briefDescription: z.string().describe('A brief one-sentence description of the website idea.'),
});
export type WebsiteBlueprintInput = z.infer<typeof WebsiteBlueprintInputSchema>;

const WebsiteBlueprintOutputSchema = z.object({
  blueprint: z.object({
    suggestedName: z.string().describe('A creative and relevant name for the website.'),
    tagline: z.string().describe('A catchy tagline for the website.'),
    pages: z.array(z.object({
        name: z.string().describe('The name of the page (e.g., Home, About Us, Services).'),
        sections: z.array(z.string().describe('A list of sections or components that should be on this page.')),
    })).describe('An array of pages that the website should have.'),
    keyFeatures: z.array(z.string()).describe('A list of recommended key features with brief explanations.'),
    techStackSuggestion: z.string().describe('A brief recommendation for a technology stack to build the website.'),
  }).describe('The detailed blueprint for the website.'),
});
export type WebsiteBlueprintOutput = z.infer<typeof WebsiteBlueprintOutputSchema>;

export async function websiteBlueprintGenerator(input: WebsiteBlueprintInput): Promise<WebsiteBlueprintOutput> {
  return websiteBlueprintGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'websiteBlueprintGeneratorPrompt',
  input: {schema: WebsiteBlueprintInputSchema},
  output: {schema: WebsiteBlueprintOutputSchema},
  prompt: `You are an expert web strategist and project manager. Your task is to take a user's raw idea and transform it into a structured, actionable blueprint for a new website. The tone should be encouraging, creative, and professional.

User's Idea:
- Website Type: {{{websiteType}}}
- Target Audience: {{{targetAudience}}}
- Core Features: {{#each coreFeatures}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Brief Description: {{{briefDescription}}}

Based on this information, generate a comprehensive website blueprint. Be creative but practical.

1.  **Suggest a Name:** Propose a creative and brandable name for the website.
2.  **Create a Tagline:** Write a short, memorable tagline.
3.  **Outline Pages & Sections:** Define a logical page structure (e.g., Home, About, Services, Blog, Contact). For each page, list the essential sections or components it should contain. For example, the Home page might have: 'Hero Section with CTA', 'Services Overview', 'Testimonials', 'Featured Blog Posts'.
4.  **Recommend Key Features:** Expand on the user's core features and suggest others that would add value.
5.  **Suggest a Tech Stack:** Provide a brief, high-level recommendation for a suitable technology stack (e.g., Next.js with TailwindCSS for a fast, modern site).

The final output must be a well-organized JSON object following the defined schema.`,
});

const websiteBlueprintGeneratorFlow = ai.defineFlow(
  {
    name: 'websiteBlueprintGeneratorFlow',
    inputSchema: WebsiteBlueprintInputSchema,
    outputSchema: WebsiteBlueprintOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
