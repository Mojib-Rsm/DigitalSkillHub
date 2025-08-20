
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
  prompt: `You are an expert OCR (Optical Character Recognition) specialist with advanced capabilities in recognizing and structuring handwritten text, even if it is not perfectly clear or neat. Your task is to analyze the provided image of a handwritten document.

1.  **Analyze the Image:** Carefully examine the image provided below.
    {{media url=photoDataUri}}

2.  **Identify Content Structure:** Determine if the handwriting is structured as a table or as plain paragraph/list-based text.

3.  **Extraction Process:**
    *   **If it's a table:**
        *   Accurately identify all column headers first.
        *   For each row, meticulously extract the text from each cell, ensuring it corresponds to the correct column header.
        *   Pay close attention to column alignment. Do not mix data between columns.
        *   If a cell appears empty, represent it as an empty string "" in the output array.
        *   If some text is hard to read, do your best to interpret it. If it's completely illegible, use "N/A" or "illegible".
        *   Set the 'isTable' flag to true.
        *   Format the output as a 2D array in the 'extractedTable' field, where each inner array is a row.
        *   The 'extractedText' field should be empty.
    *   **If it's not a table:**
        *   Set 'isTable' to false.
        *   Extract all text into a single string, preserving paragraphs and line breaks, and place it in the 'extractedText' field.
        *   The 'extractedTable' field should be an empty array.

4.  **Provide Output:** Populate the output JSON with the extracted data.
    -   isTable: Your determination of the content structure.
    -   extractedText: The full text if not a table.
    -   extractedTable: The 2D array if it is a table.
    -   explanation: Briefly describe what you have extracted, for example, "I have extracted the content as a table with X rows and Y columns." or "I have extracted the text content from the provided note."
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
