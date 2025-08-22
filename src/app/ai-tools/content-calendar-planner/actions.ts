
"use server";

import { contentCalendarPlanner, ContentCalendarPlannerOutput } from "@/ai/flows/content-calendar-planner";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const ContentCalendarPlannerActionSchema = z.object({
  topic: z.string().min(5, { message: "Please enter a topic." }),
  platform: z.enum(['Blog', 'Social Media']),
  duration: z.string().min(3, { message: "Please select a duration." }),
});

type FormState = {
  message: string;
  calendar?: ContentCalendarPlannerOutput['calendar'];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateContentCalendar(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ContentCalendarPlannerActionSchema.safeParse({
    topic: formData.get("topic"),
    platform: formData.get("platform"),
    duration: formData.get("duration"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
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
        message: "success",
        calendar: result.calendar,
      };
    } else {
        return { message: "Failed to generate calendar. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
