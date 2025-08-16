
'use server';

/**
 * @fileOverview AI tool to generate product descriptions.
 *
 * - productDescriptionGenerator - A function that generates product descriptions.
 * - ProductDescriptionGeneratorInput - The input type for the productDescriptionGenerator function.
 * - ProductDescriptionGeneratorOutput - The return type for the productDescriptionGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductDescriptionGeneratorInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productFeatures: z.string().describe('A comma-separated list of key product features.'),
  targetAudience: z.string().describe('The target audience for the product.'),
});
export type ProductDescriptionGeneratorInput = z.infer<typeof ProductDescriptionGeneratorInputSchema>;

const ProductDescriptionGeneratorOutputSchema = z.object({
  description: z.string().describe('The generated product description.'),
});
export type ProductDescriptionGeneratorOutput = z.infer<typeof ProductDescriptionGeneratorOutputSchema>;

export async function productDescriptionGenerator(input: ProductDescriptionGeneratorInput): Promise<ProductDescriptionGeneratorOutput> {
  return productDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productDescriptionGeneratorPrompt',
  input: {schema: ProductDescriptionGeneratorInputSchema},
  output: {schema: ProductDescriptionGeneratorOutputSchema},
  prompt: `You are an expert copywriter specializing in e-commerce.

You will generate a compelling product description based on the provided information. The tone should be persuasive and highlight the benefits for the target audience. The language should be simple and clear, suitable for a diverse audience in Bangladesh.

Product Name: {{{productName}}}
Key Features: {{{productFeatures}}}
Target Audience: {{{targetAudience}}}

Generate a product description of about 50-70 words.`,
});

const productDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'productDescriptionGeneratorFlow',
    inputSchema: ProductDescriptionGeneratorInputSchema,
    outputSchema: ProductDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
