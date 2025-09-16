
'use server';

/**
 * @fileOverview A simple rule-based chatbot that answers questions about TotthoAi without external APIs.
 *
 * - chatbot - A function that handles the chatbot conversation.
 * - ChatbotInput - The input type for the chatbot function.
 * - ChatbotOutput - The return type for the chatbot function.
 */

// Define the input and output types for our function.
// These are kept simple for a rule-based system.
export interface ChatbotInput {
  message: string;
  history: Array<{ role: 'user' | 'model'; content: string }>;
}

export interface ChatbotOutput {
  reply: string;
}

// This is the main function that will be called by the server action.
export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  const userMessage = input.message.toLowerCase();

  // Rule 1: Check for CEO
  if (userMessage.includes('ceo') || userMessage.includes('সিইও')) {
    return {
      reply: 'আমাদের কোম্পানির CEO হলেন Mojibur Rahman।',
    };
  }

  // Rule 2: Check for address
  if (userMessage.includes('address') || userMessage.includes('ঠিকানা')) {
    return {
      reply:
        'আমাদের অফিসের ঠিকানা হলো গ্রাম: দরিয়ারদিঘী, ওয়ার্ড নং- ০১, ডাকঘর: রাবিতা- ৪৭০০, উপজেলা: রামু, জেলা: কক্সবাজার।',
    };
  }

  // Rule 3: Check for courses
  if (userMessage.includes('course') || userMessage.includes('কোর্স')) {
    return {
      reply:
        'আমাদের অনেকগুলো কোর্স রয়েছে, যেমন: ডিজিটাল লিটারেসি, ফ্রিল্যান্সিং বেসিকস, এবং ই-কমার্স। আপনি আমাদের কোর্স পেজে সবগুলো কোর্স দেখতে পারেন।',
    };
  }
  
  // Rule 4: Check for freelance ideas
  if (userMessage.includes('freelance') || userMessage.includes('ফ্রিল্যান্স')) {
      return {
          reply: 'আপনি আপনার দক্ষতার উপর ভিত্তি করে ফ্রিল্যান্সিং শুরু করতে পারেন। যেমন, গ্রাফিক ডিজাইন, কনটেন্ট লেখা, বা ডিজিটাল মার্কেটিং। আরও আইডিয়া পেতে আমাদের "ফ্রিল্যান্স আইডিয়া জেনারেটর" টুলটি ব্যবহার করতে পারেন।'
      }
  }

  // Default fallback response
  return {
    reply:
      'আমি আপনার প্রশ্নটি বুঝতে পারিনি। আপনি কি CEO, অফিস ঠিকানা, কোর্স বা ফ্রিল্যান্সিং সম্পর্কে জানতে চান?',
  };
}
