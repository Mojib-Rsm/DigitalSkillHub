
"use server";

import { storyPlotGenerator, StoryPlotGeneratorOutput } from "@/ai/flows/story-plot-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const StoryPlotGeneratorActionSchema = z.object({
  genre: z.string().min(3, { message: "Please enter a genre." }),
  premise: z.string().min(10, { message: "Please enter a premise of at least 10 characters." }),
  keyElements: z.string().min(3, { message: "Please enter at least one key element." }),
});

type FormState = {
  message: string;
  plot?: StoryPlotGeneratorOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateStoryPlot(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = StoryPlotGeneratorActionSchema.safeParse({
    genre: formData.get("genre"),
    premise: formData.get("premise"),
    keyElements: formData.get("keyElements"),
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
    const result = await storyPlotGenerator(validatedFields.data);
    if (result) {
      await saveHistoryAction({
          tool: 'story-plot-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        plot: result,
      };
    } else {
        return { message: "Failed to generate plot. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
