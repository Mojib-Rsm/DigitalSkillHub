
'use server';

/**
 * @fileOverview AI tool to generate Facebook captions for a post.
 *
 * - facebookCaptionGenerator - A function that generates captions.
 * - FacebookCaptionGeneratorInput - The input type for the function.
 * - FacebookCaptionGeneratorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FacebookCaptionGeneratorInputSchema = z.object({
  postTopic: z.string().optional().describe('An optional description of the post\'s topic or what the user wants to convey.'),
  photoDataUri: z
    .string()
    .describe(
      "A photo for the post, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FacebookCaptionGeneratorInput = z.infer<typeof FacebookCaptionGeneratorInputSchema>;

const FacebookCaptionGeneratorOutputSchema = z.object({
  bengaliCaptions: z.array(z.string()).describe('A list of 3-5 suggested captions in Bengali.'),
  englishCaptions: z.array(z.string()).describe('A list of 3-5 suggested captions in English.'),
  hashtags: z.array(z.string()).describe('A list of 5-10 relevant hashtags.'),
});
export type FacebookCaptionGeneratorOutput = z.infer<typeof FacebookCaptionGeneratorOutputSchema>;

export async function facebookCaptionGenerator(input: FacebookCaptionGeneratorInput): Promise<FacebookCaptionGeneratorOutput> {
  return facebookCaptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'facebookCaptionGeneratorPrompt',
  input: {schema: FacebookCaptionGeneratorInputSchema},
  output: {schema: FacebookCaptionGeneratorOutputSchema},
  prompt: `You are an expert social media manager specializing in viral, human-like Facebook captions. Your writing is engaging, authentic, and optimized for reach.

Generate a set of Facebook captions based on the provided image and optional topic.

Image to analyze:
{{media url=photoDataUri}}

{{#if postTopic}}
User's Topic/Goal for the post:
{{{postTopic}}}
{{/if}}

Instructions:
1.  **Analyze the Image:** Carefully analyze the image to understand its content, mood, and subject matter.
2.  **Generate Captions:** Create two sets of captions:
    *   A list of 3-5 engaging captions in **Bengali**.
    *   A list of 3-5 engaging captions in **English**.
3.  **Generate Hashtags:** Create a single list of 5-10 relevant hashtags that apply to the post. Include a mix of broad and niche tags.
4.  **Tone & Style:** The captions should be conversational, creative, and feel like a real person wrote them. They should be suitable for a Facebook audience.

The final output MUST be a complete JSON object following the schema.`,
});

const facebookCaptionGeneratorFlow = ai.defineFlow(
  {
    name: 'facebookCaptionGeneratorFlow',
    inputSchema: FacebookCaptionGeneratorInputSchema,
    outputSchema: FacebookCaptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
