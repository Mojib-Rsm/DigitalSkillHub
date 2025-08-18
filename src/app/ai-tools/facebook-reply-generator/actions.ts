
"use server";

import { facebookReplyGenerator } from "@/ai/flows/facebook-reply-generator";
import { z } from "zod";

const FacebookReplyGeneratorActionSchema = z.object({
  postContent: z.string().min(10, { message: "অনুগ্রহ করে পোস্টের বিষয়বস্তু লিখুন (কমপক্ষে ১০ অক্ষর)।" }),
  conversation: z.array(z.object({
    character: z.string(),
    text: z.string().min(1, { message: "কথোপকথনের প্রতিটি অংশের জন্য পাঠ্য প্রয়োজন।" }),
  })).min(1, { message: "অনুগ্রহ করে কমপক্ষে একটি কথোপকথনের অংশ যোগ করুন।" }),
  goal: z.string().optional(),
});

type FormState = {
  message: string;
  suggestions?: string[];
  fields?: Record<string, any>;
  issues?: string[];
};

export async function generateFacebookReplies(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const conversationEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith('conversation'));
  
  const conversationMap: Record<string, { character?: string; text?: string }> = {};

  for (const [key, value] of conversationEntries) {
      const match = key.match(/conversation\[(\d+)\]\.(character|text)/);
      if (match) {
          const index = match[1];
          const field = match[2];
          if (!conversationMap[index]) {
              conversationMap[index] = {};
          }
          conversationMap[index][field as 'character' | 'text'] = value as string;
      }
  }

  const parsedConversation = Object.values(conversationMap).map(item => ({
      character: item.character || '',
      text: item.text || '',
  }));


  const validatedFields = FacebookReplyGeneratorActionSchema.safeParse({
    postContent: formData.get("postContent"),
    conversation: parsedConversation,
    goal: formData.get("goal"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    
    // Create a flat list of fields for easier state restoration
    const fields: Record<string, any> = { postContent: formData.get("postContent"), goal: formData.get("goal") };
    parsedConversation.forEach((item, index) => {
        fields[`conversation[${index}].character`] = item.character;
        fields[`conversation[${index}].text`] = item.text;
    });
    fields.conversationLength = parsedConversation.length;

    return {
      message: "Validation Error",
      issues: errors.flatMap(e => e.path.length > 1 ? `Conversaton part #${Number(e.path[1])+1}: ${e.message}` : e.message),
      fields,
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
