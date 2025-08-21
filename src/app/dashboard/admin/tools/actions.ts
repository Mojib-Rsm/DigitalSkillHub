
'use server';

import { z } from 'zod';
import { addTool, updateTool, type Tool } from '@/services/tool-service';
import { getCurrentUser } from '@/services/user-service';

const toolSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  href: z.string().startsWith('/'),
  icon: z.string().min(1),
  category: z.string().min(3),
  enabled: z.boolean(),
});

type FormState = {
  success: boolean;
  message: string;
  tool?: Tool;
};

export async function saveToolAction(
  toolId: string | null,
  data: z.infer<typeof toolSchema>
): Promise<FormState> {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied.' };
  }

  const validatedData = toolSchema.safeParse(data);
  if (!validatedData.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  let result;
  try {
    if (toolId) {
      // Update existing tool
      result = await updateTool(toolId, validatedData.data);
      if (result.success) {
        return { success: true, message: 'Tool updated.', tool: { id: toolId, ...validatedData.data } };
      }
    } else {
      // Create new tool
      result = await addTool(validatedData.data);
       if (result.success) {
         // Since addDoc doesn't return the new ID, we can't return the full tool object here.
         // The UI will have to refetch or handle this optimistically.
         // For now, we'll return a partial object and the UI can update. This is a simplification.
         // A more robust solution might involve another fetch after creation.
         const newTool = { id: `new_${Date.now()}`, ...validatedData.data}; // temporary ID for UI
         return { success: true, message: 'Tool created.', tool: newTool };
      }
    }
    return { success: false, message: result.message || 'An unknown error occurred.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}

    