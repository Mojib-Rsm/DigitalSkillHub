import { z } from 'zod';

export const TextToSpeechOutputSchema = z.object({
    media: z.string().describe('The base64 encoded wav audio file.'),
});

export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
