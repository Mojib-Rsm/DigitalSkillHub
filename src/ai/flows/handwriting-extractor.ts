
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
  prompt: `You are an expert data entry specialist. Your task is to extract all the text from the provided image of a handwritten table and structure it perfectly into a 2D array.

Image to process:
{{media url=photoDataUri}}

Instructions:
1.  Assume the content is a table. Set 'isTable' to true.
2.  Extract EVERY row and EVERY column. Do not miss any data.
3.  The first row of the output array should be the column headers.
4.  Subsequent rows in the array should correspond to the rows in the image's table.
5.  Ensure that the data for each cell is placed in the correct column.
6.  If a cell in the table is empty, represent it as an empty string ("").
7.  Do your best to read unclear handwriting. Do not make up information. If something is truly illegible, write "illegible".
8.  Populate the 'extractedTable' field with the resulting 2D array.
9.  The 'extractedText' field should be an empty string.
10. For the 'explanation', provide a simple summary, like: "I have extracted a table with [Number of Rows] rows and [Number of Columns] columns."
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
