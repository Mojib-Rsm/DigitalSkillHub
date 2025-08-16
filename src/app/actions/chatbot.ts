
'use server';

import { chatbot, ChatbotInput, ChatbotOutput } from "@/ai/flows/chatbot";

export async function chatbotAction(input: ChatbotInput): Promise<ChatbotOutput> {
  try {
    const result = await chatbot(input);
    return result;
  } catch (error) {
    console.error("Error in chatbot server action:", error);
    return { reply: "দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।" };
  }
}

    
