
"use server";

import { scriptWriter } from "@/ai/flows/script-writer";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const ScriptWriterActionSchema = z.object({
  topic: z.string().min(5, { message: "Please enter a topic." }),
  durationInMinutes: z.coerce.number().min(1).max(10),
  platform: z.enum(['YouTube', 'TikTok']),
  style: z.string().min(3, { message: "Please enter a style." }),
});

type FormState = {
  message: string;
  script?: string;
  fields?: Record<string, string | number>;
  issues?: string[];
};

export async function generateScript(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ScriptWriterActionSchema.safeParse({
    topic: formData.get("topic"),
    durationInMinutes: formData.get("durationInMinutes"),
    platform: formData.get("platform"),
    style: formData.get("style"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        topic: formData.get("topic") as string,
        durationInMinutes: Number(formData.get("durationInMinutes")),
        platform: formData.get("platform") as string,
        style: formData.get("style") as string,
      }
    };
  }
  
  try {
    const result = await scriptWriter(validatedFields.data);
    if (result.script) {
      await saveHistoryAction({
          tool: 'script-writer',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        script: result.script,
      };
    } else {
        return { message: "Failed to generate script. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
