
'use server';

import { z } from 'zod';
import { addTool, updateTool } from '@/services/tool-service';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';
import type { Tool } from '@/lib/demo-data';

const toolSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  href: z.string().startsWith('/'),
  icon: z.string().min(1),
  category: z.string().min(3),
  enabled: z.boolean(),
  isFree: z.boolean(),
  credits: z.coerce.number().min(0),
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
        revalidatePath('/dashboard/admin/tools');
        return { success: true, message: 'Tool updated.', tool: { id: toolId, ...validatedData.data } };
      }
    } else {
      // Create new tool
      result = await addTool(validatedData.data);
       if (result.success && result.id) {
         revalidatePath('/dashboard/admin/tools');
         const newTool: Tool = { id: result.id, ...validatedData.data}; 
         return { success: true, message: 'Tool created.', tool: newTool };
      }
    }
    return { success: false, message: result.message || 'An unknown error occurred.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
