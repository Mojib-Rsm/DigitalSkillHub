import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({apiKey: process.env.GEMINI_API_KEY}),
    googleAI({apiKey: process.env.GEMINI_API_KEY_2}),
  ],
  model: 'googleai/gemini-1.5-flash-latest',
});
