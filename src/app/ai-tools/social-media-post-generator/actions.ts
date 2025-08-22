
"use server";

import { socialMediaPostGenerator } from "@/ai/flows/social-media-post-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const SocialMediaPostGeneratorActionSchema = z.object({
  topic: z.string().min(3, { message: "Please enter a topic." }),
  platform: z.string().min(1, { message: "Please select a platform." }),
  tone: z.string().min(1, { message: "Please select a tone." }),
});

type FormState = {
  message: string;
  post?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generatePost(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SocialMediaPostGeneratorActionSchema.safeParse({
    topic: formData.get("topic"),
    platform: formData.get("platform"),
    tone: formData.get("tone"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        topic: formData.get("topic") as string,
        platform: formData.get("platform") as string,
        tone: formData.get("tone") as string,
      }
    };
  }
  
  try {
    const result = await socialMediaPostGenerator(validatedFields.data);
    if (result.post) {
      await saveHistoryAction({
          tool: 'social-media-post-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        post: result.post,
      };
    } else {
        return { message: "Failed to generate post. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
