
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
  photoDataUris: z.array(z
    .string()
    .describe(
      "A clear photo of a handwritten document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
  ).describe('An array of handwritten document photos.'),
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
  prompt: `You are a professional and intelligent data entry assistant. Your task is to extract all text from a series of handwritten document images and structure them into a single, cohesive table. You must act as a smart assistant, correcting obvious errors and ensuring data integrity across all provided images.

Images to process:
{{#each photoDataUris}}
Image {{@index}}: {{media url=this}}
{{/each}}

Instructions:
1.  **Act as an Intelligent Assistant:** Your primary goal is accuracy and cohesion. You are processing multiple images that represent a single, continuous dataset.
2.  **Combine All Data:** Treat all images as parts of one single table. Combine all rows from all images into one final table.
3.  **Correct Serial Numbers:** Pay close attention to serial numbers (like 'ক্রমিক নং'). If the serial number sequence is broken across images (e.g., Image 1 ends at 5, Image 2 starts at 1 but should be 6), you MUST correct it to maintain a continuous sequence.
4.  **Complete and Accurate Extraction:** Extract EVERY piece of text from EVERY cell. Place data in the correct column under the correct header. The first row of the output array MUST be the column headers.
5.  **Handle Empty or Illegible Cells:** If a cell is empty, represent it with an empty string (""). If text is truly illegible, write "illegible". Do not guess information.
6.  **Final Output Structure:**
    *   Set 'isTable' to true.
    *   The 'extractedText' field should be an empty string.
    *   Populate 'extractedTable' with the final, combined, and corrected 2D array.
    *   For the 'explanation', provide a summary of your work, like: "I have combined the data from [Number of Images] images into a single table with [Total Number of Rows] rows and [Number of Columns] columns. I have also corrected the serial number sequence to ensure continuity."
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
