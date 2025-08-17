
"use server";

import { facebookReplyGenerator } from "@/ai/flows/facebook-reply-generator";
import { z } from "zod";

const FacebookReplyGeneratorActionSchema = z.object({
  postContent: z.string().min(10, { message: "অনুগ্রহ করে পোস্টের বিষয়বস্তু লিখুন (কমপক্ষে ১০ অক্ষর)।" }),
  commentToReply: z.string().min(1, { message: "অনুগ্রহ করে যে কমেন্টের উত্তর দিতে চান তা লিখুন।" }),
});

type FormState = {
  message: string;
  suggestions?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateFacebookReplies(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FacebookReplyGeneratorActionSchema.safeParse({
    postContent: formData.get("postContent"),
    commentToReply: formData.get("commentToReply"),
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
    const result = await facebookReplyGenerator(validatedFields.data);

    if (result.suggestions && result.suggestions.length > 0) {
      return {
        message: "success",
        suggestions: result.suggestions,
      };
    } else {
        return { message: "কোনো উত্তর তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।" }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}
