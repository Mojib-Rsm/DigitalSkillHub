
"use server";

import { facebookReplyGenerator } from "@/ai/flows/facebook-reply-generator";
import { z } from "zod";

const FacebookReplyGeneratorActionSchema = z.object({
  postContent: z.string().min(10, { message: "অনুগ্রহ করে পোস্টের বিষয়বস্তু লিখুন (কমপক্ষে ১০ অক্ষর)।" }),
  conversation: z.array(z.object({
    id: z.string(), // Keep id for React key but it's not sent to AI
    character: z.string().min(1, {message: "চরিত্র নির্বাচন করুন।"}),
    text: z.string().min(1, { message: "কথোপকথনের প্রতিটি অংশের জন্য পাঠ্য প্রয়োজন।" }),
  })).min(1, { message: "অনুগ্রহ করে কমপক্ষে একটি কথোপকথনের অংশ যোগ করুন।" }),
  goal: z.string().optional(),
  customGoal: z.string().optional(),
}).refine(data => {
    if (data.goal === 'Other' && (!data.customGoal || data.customGoal.length < 5)) {
        return false;
    }
    return true;
}, {
    message: "অন্যান্য নির্বাচন করলে অনুগ্রহ করে আপনার লক্ষ্য লিখুন (কমপক্ষে ৫ অক্ষর)।",
    path: ["customGoal"],
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
  
  const conversationMap: { [key: string]: { id?: string; character?: string; text?: string } } = {};

  for (const [key, value] of conversationEntries) {
      const match = key.match(/conversation\[(\d+)\]\.(id|character|text)/);
      if (match) {
          const index = match[1];
          const field = match[2];
          if (!conversationMap[index]) {
              conversationMap[index] = {};
          }
          conversationMap[index][field as 'id' | 'character' | 'text'] = value as string;
      }
  }
  
  const parsedConversation = Object.values(conversationMap).map(item => ({
      id: item.id || '',
      character: item.character || '',
      text: item.text || '',
  }));


  const validatedFields = FacebookReplyGeneratorActionSchema.safeParse({
    postContent: formData.get("postContent"),
    conversation: parsedConversation,
    goal: formData.get("goal"),
    customGoal: formData.get("customGoal"),
  });
  
  const getFields = () => {
     const fields: Record<string, any> = { 
        postContent: formData.get("postContent"), 
        goal: formData.get("goal"),
        customGoal: formData.get("customGoal"),
        conversation: parsedConversation,
    };
    return fields;
  }

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;

    return {
      message: "Validation Error",
      issues: errors.flatMap(e => {
          if (e.path.length > 1 && e.path[0] === 'conversation') {
              const index = e.path[1];
              const field = e.path[2];
              return `কথোপকথন #${Number(index) + 1} (${field}): ${e.message}`;
          }
          return e.message;
      }),
      fields: getFields(),
    };
  }
  
  try {
    const { postContent, conversation, goal, customGoal } = validatedFields.data;
    
    // If goal is "Other", use the customGoal as the actual goal for the AI
    const finalGoal = goal === 'Other' ? customGoal : goal;
    
    // We don't need to send the ID to the AI flow, just character and text
    const conversationForAI = conversation.map(({ character, text }) => ({ character, text }));

    const result = await facebookReplyGenerator({
        postContent,
        conversation: conversationForAI,
        goal: finalGoal,
    });

    if (result.suggestions && result.suggestions.length > 0) {
      return {
        message: "success",
        suggestions: result.suggestions,
      };
    } else {
        return { 
            message: "কোনো উত্তর তৈরি করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন。",
            fields: getFields(),
        }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
      fields: getFields(),
    };
  }
}
