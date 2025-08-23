
"use server";

import { contentCalendarPlanner, ContentCalendarPlannerOutput } from "@/ai/flows/content-calendar-planner";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const ContentCalendarPlannerActionSchema = z.object({
  topic: z.string().min(5, { message: "Please enter a topic." }),
  platform: z.enum(['Blog', 'Social Media']),
  duration: z.string().min(3, { message: "Please select a duration." }),
});

export async function generateContentCalendarAction(
  formData: FormData
): Promise<{ success: boolean; data?: ContentCalendarPlannerOutput; issues?: z.ZodIssue[]; fields?: Record<string, string>}> {
  const validatedFields = ContentCalendarPlannerActionSchema.safeParse({
    topic: formData.get("topic"),
    platform: formData.get("platform"),
    duration: formData.get("duration"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.errors,
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  try {
    const result = await contentCalendarPlanner(validatedFields.data);
    if (result.calendar) {
      await saveHistoryAction({
          tool: 'content-calendar-planner',
          input: validatedFields.data,
          output: result,
      });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: [{ path: ['root'], message: "Failed to generate calendar. Please try again."}] }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      issues: [{ path: ['root'], message: "An unexpected error occurred. Please try again."}],
    };
  }
}
