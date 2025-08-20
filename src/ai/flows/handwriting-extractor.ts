
'use server';

/**
 * @fileOverview AI tool to extract text from a handwritten document and convert it to structured data.
 *
 * - handwritingExtractor - A function that extracts text from an image.
 * - HandwritingExtractorInput - The input type for the function.
 * - HandwritingExtractorOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandwritingExtractorInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A clear photo of a handwritten document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type HandwritingExtractorInput = z.infer<typeof HandwritingExtractorInputSchema>;

const HandwritingExtractorOutputSchema = z.object({
  isTable: z.boolean().describe('Whether the extracted content is a table.'),
  extractedText: z.string().describe('The full extracted text if it is not a table.'),
  extractedTable: z.array(z.array(z.string())).describe('A 2D array representing the table rows and columns if the content is a table.'),
  explanation: z.string().describe('A brief explanation of the extracted content.'),
});
export type HandwritingExtractorOutput = z.infer<typeof HandwritingExtractorOutputSchema>;

export async function handwritingExtractor(input: HandwritingExtractorInput): Promise<HandwritingExtractorOutput> {
  return handwritingExtractorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handwritingExtractorPrompt',
  input: {schema: HandwritingExtractorInputSchema},
  output: {schema: HandwritingExtractorOutputSchema},
  prompt: `You are a professional and intelligent data entry assistant. Your task is to extract all text from a handwritten document image and structure it into a cohesive table if it's tabular data. You must act as a smart assistant, correcting obvious errors and ensuring data integrity.

Image to process:
{{media url=photoDataUri}}

Instructions:
1.  **Analyze the Structure:** First, determine if the content in the image is a table or plain text.
2.  **Act as an Intelligent Assistant:** Your primary goal is accuracy.
3.  **Correct Serial Numbers:** If the data is a table, pay close attention to serial numbers (like 'ক্রমিক নং'). If the serial number sequence is broken, you MUST correct it to maintain a continuous sequence.
4.  **Complete and Accurate Extraction:** Extract EVERY piece of text. If it is a table, place data in the correct column under the correct header. The first row of the output array MUST be the column headers.
5.  **Handle Empty or Illegible Cells:** If a cell is empty, represent it with an empty string (""). If text is truly illegible, write "illegible". Do not guess information.
6.  **Final Output Structure:**
    *   Set 'isTable' to true if it is a table, otherwise false.
    *   If it's not a table, put all extracted text in the 'extractedText' field. 'extractedTable' should be an empty array.
    *   If it is a table, populate 'extractedTable' with the final, corrected 2D array. 'extractedText' should be an empty string.
    *   For the 'explanation', provide a summary of your work, like: "I have extracted the data as a table with [Total Number of Rows] rows and [Number of Columns] columns. I have also corrected the serial number sequence." or "I have extracted the text content from the provided note."
`,
});

const handwritingExtractorFlow = ai.defineFlow(
  {
    name: 'handwritingExtractorFlow',
    inputSchema: HandwritingExtractorInputSchema,
    outputSchema: HandwritingExtractorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
