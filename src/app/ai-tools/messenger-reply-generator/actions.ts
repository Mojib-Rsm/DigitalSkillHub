
"use server";

import { messengerReplyGenerator, MessengerReplyGeneratorInput, MessengerReplyGeneratorOutput } from "@/ai/flows/messenger-reply-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";


const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const MessengerReplyGeneratorActionSchema = z.object({
  conversation: z.array(z.object({
    character: z.string(),
    text: z.string(),
  })).optional(),
  goal: z.string().optional(),
  customGoal: z.string().optional(),
  photo: z
    .any()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `ছবির আকার 4MB এর বেশি হতে পারবে না।`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সমর্থিত।"
    ).optional(),
}).refine(data => {
    if (data.goal === 'Other' && (!data.customGoal || data.customGoal.length < 5)) {
        return false;
    }
    return true;
}, {
    message: "অন্যান্য নির্বাচন করলে অনুগ্রহ করে আপনার লক্ষ্য লিখুন (কমপক্ষে ৫ অক্ষর)।",
    path: ["customGoal"],
}).refine(data => {
    // If there is no photo, at least one conversation part must exist and have text.
    if (!data.photo || data.photo.size === 0) {
        return data.conversation && data.conversation.length > 0 && data.conversation.some(part => part.text.length > 0);
    }
    return true;
}, {
    message: "ছবি ছাড়া অন্তত একটি কথোপকথনের অংশ এবং টেক্সট যোগ করুন।",
    path: ["conversation"],
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
  })).filter(part => part.text.length > 0);


  const validatedFields = MessengerReplyGeneratorActionSchema.safeParse({
    conversation: parsedConversation.length > 0 ? parsedConversation : undefined,
    goal: formData.get("goal"),
    customGoal: formData.get("customGoal"),
    photo: formData.get("photo"),
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
    const { conversation, goal, customGoal, photo } = validatedFields.data;
    
    const finalGoal = goal === 'Other' ? customGoal : goal;
    let photoDataUri;

    if (photo && photo.size > 0) {
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;
    }

    const flowInput: MessengerReplyGeneratorInput = { goal: finalGoal, photoDataUri };
    if (conversation && conversation.length > 0) {
        flowInput.conversation = conversation;
    }

    const result = await messengerReplyGenerator(flowInput);

    if (result.suggestions && result.suggestions.length > 0) {
      await saveHistoryAction({
          tool: 'messenger-reply-generator',
          input: { goal: finalGoal, has_image: !!photoDataUri },
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
