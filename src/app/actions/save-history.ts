
'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';
import { HistoryModel } from '@/models/historyModel';

const HistoryItemSchema = z.object({
  tool: z.string(),
  input: z.any(),
  output: z.any(),
});

type HistoryItem = z.infer<typeof HistoryItemSchema>;


export async function saveHistoryAction(item: HistoryItem) {
  const user = await getCurrentUser();

  if (!user) {
    console.warn('Cannot save history: user is not logged in.');
    // Don't throw an error, just return, as this is not a critical failure for the user.
    return;
  }

  const validatedItem = HistoryItemSchema.safeParse(item);
  if (!validatedItem.success) {
    console.error('Invalid history item:', validatedItem.error);
    throw new Error('Invalid history item data');
  }

  try {
    await HistoryModel.create({
      user_id: user.id,
      tool: validatedItem.data.tool,
      input: JSON.stringify(validatedItem.data.input),
      output: JSON.stringify(validatedItem.data.output),
    });
  } catch (error) {
    console.error('Failed to save history to MySQL:', error);
    // Don't throw error to the client, just log it.
  }
}
