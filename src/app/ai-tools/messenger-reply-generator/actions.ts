
"use server";

import { messengerReplyGenerator } from "@/ai/flows/messenger-reply-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const MessengerReplyGeneratorActionSchema = z.object({
  conversation: z.array(z.object({
    character: z.string(),
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

export async function generateMessengerReplies(
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


  const validatedFields = MessengerReplyGeneratorActionSchema.safeParse({
    conversation: parsedConversation,
    goal: formData.get("goal"),
    customGoal: formData.get("customGoal"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    
    const fields: Record<string, any> = { 
        goal: formData.get("goal"),
        customGoal: formData.get("customGoal"),
    };
    parsedConversation.forEach((item, index) => {
        fields[`conversation[${index}].character`] = item.character;
        fields[`conversation[${index}].text`] = item.text;
    });
    fields.conversationLength = parsedConversation.length;

    return {
      message: "Validation Error",
      issues: errors.flatMap(e => e.path.length > 1 && e.path[0] === 'conversation' ? `Conversaton part #${Number(e.path[1])+1}: ${e.message}` : e.message),
      fields,
    };
  }
  
  try {
    const { conversation, goal, customGoal } = validatedFields.data;
    
    const finalGoal = goal === 'Other' ? customGoal : goal;
    const flowInput = { conversation, goal: finalGoal };

    const result = await messengerReplyGenerator(flowInput);

    if (result.suggestions && result.suggestions.length > 0) {
      await saveHistoryAction({
          tool: 'messenger-reply-generator',
          input: flowInput,
          output: result,
      });
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
