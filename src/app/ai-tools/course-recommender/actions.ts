
"use server";

import { courseRecommender } from "@/ai/flows/course-recommender";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const CourseRecommenderActionSchema = z.object({
  interests: z.string().min(3, { message: "Please enter at least one interest." }),
});

type FormState = {
  message: string;
  recommendations?: { courseName: string; reason: string }[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function recommendCourses(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = CourseRecommenderActionSchema.safeParse({
    interests: formData.get("interests"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        interests: formData.get("interests") as string,
      }
    };
  }
  
  try {
    const result = await courseRecommender(validatedFields.data);
    if (result.recommendations && result.recommendations.length > 0) {
      await saveHistoryAction({
          tool: 'course-recommender',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        recommendations: result.recommendations,
      };
    } else {
        return { message: "Could not find any recommendations. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
