
'use server';

/**
 * @fileOverview AI tool to extract text from handwritten documents and convert it to structured data.
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
  prompt: `You are an expert data entry specialist with an exceptional ability to read and interpret handwritten documents. Your task is not just to transcribe, but to act as an intelligent assistant. You will extract all text from the provided image of a handwritten table and structure it into a perfect 2D array, correcting obvious mistakes.

Image to process:
{{media url=photoDataUri}}

Instructions:
1.  **Act as an Intelligent Assistant:** Your primary goal is accuracy. If you see a clear, simple mistake (e.g., a sequential number is wrong like 1, 2, 4, 5, you should correct it to 1, 2, 3, 4, 5), you should correct it. Do not guess information, but use context to fix obvious errors.
2.  **Table First:** Assume the content is a table. Set 'isTable' to true.
3.  **Complete Extraction:** Extract EVERY row and EVERY column. Do not miss any data.
4.  **Headers are Key:** The first row of the output array MUST be the column headers from the image.
5.  **Correct Placement:** Ensure the data for each cell is placed in the correct column corresponding to the headers.
6.  **Handle Empty Cells:** If a cell in the table is visibly empty, represent it as an empty string ("").
7.  **Illegible Text:** If handwriting is truly impossible to read, write "illegible". Do not make up information.
8.  **Output Fields:**
    *   Populate the 'extractedTable' field with the resulting 2D array.
    *   The 'extractedText' field should be an empty string.
    *   For the 'explanation', provide a simple summary, like: "I have extracted a table with [Number of Rows] rows and [Number of Columns] columns, and I have corrected a sequencing error in the serial number column."
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
