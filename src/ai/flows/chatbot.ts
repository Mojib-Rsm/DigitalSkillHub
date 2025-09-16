
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

  const rules = [
    {
      keywords: ['ceo', 'সিইও', 'প্রতিষ্ঠাতা', 'founder'],
      response: 'আমাদের কোম্পানির CEO হলেন Mojibur Rahman।',
    },
    {
      keywords: ['address', 'ঠিকানা', 'অফিস', 'office'],
      response:
        'আমাদের অফিসের ঠিকানা হলো গ্রাম: দরিয়ারদিঘী, ওয়ার্ড নং- ০১, ডাকঘর: রাবিতা- ৪৭০০, উপজেলা: রামু, জেলা: কক্সবাজার।',
    },
    {
      keywords: ['course', 'কোর্স', 'প্রশিক্ষণ', 'training'],
      response:
        'আমাদের অনেকগুলো কোর্স রয়েছে, যেমন: ডিজিটাল লিটারেসি, ফ্রিল্যান্সিং বেসিকস, এবং ই-কমার্স। আপনি আমাদের কোর্স পেজে সবগুলো কোর্স দেখতে পারেন।',
    },
    {
      keywords: ['freelance', 'ফ্রিল্যান্স', 'idea', 'আইডিয়া'],
      response:
        'আপনি আপনার দক্ষতার উপর ভিত্তি করে ফ্রিল্যান্সিং শুরু করতে পারেন। যেমন, গ্রাফিক ডিজাইন, কনটেন্ট লেখা, বা ডিজিটাল মার্কেটিং। আরও আইডিয়া পেতে আমাদের "ফ্রিল্যান্স আইডিয়া জেনারেটর" টুলটি ব্যবহার করতে পারেন।',
    },
    {
        keywords: ['tool', 'টুল', 'tools', 'service', 'সার্ভিস'],
        response: 'আমাদের অনেকগুলো AI টুল রয়েছে, যেমন: কন্টেন্ট রাইটার, ইমেজ জেনারেটর, এবং সোশ্যাল মিডিয়া পোস্ট ক্রিয়েটর। আপনি আমাদের "AI Tools" পেজ থেকে সবগুলো টুল দেখতে পারেন।'
    },
    {
        keywords: ['payment', 'পেমেন্ট', 'price', 'দাম', 'plan', 'প্ল্যান'],
        response: 'আমাদের বিভিন্ন সাবস্ক্রিপশন প্ল্যান রয়েছে। আপনি "Pricing" পেজ থেকে সকল প্ল্যান এবং মূল্য সম্পর্কে বিস্তারিত জানতে পারবেন। আমরা বিকাশ এবং নগদের মাধ্যমে পেমেন্ট গ্রহণ করি।'
    },
    {
        keywords: ['support', 'সাপোর্ট', 'help', 'সাহায্য', 'contact', 'যোগাযোগ'],
        response: 'যেকোনো সাহায্যের জন্য, আপনি আমাদের কন্টাক্ট পেজের মাধ্যমে যোগাযোগ করতে পারেন অথবা সরাসরি support@totthoai.com-এ ইমেল করতে পারেন।'
    }
  ];

  for (const rule of rules) {
    if (rule.keywords.some(keyword => userMessage.includes(keyword))) {
      return {
        reply: rule.response,
      };
    }
  }

  // Default fallback response if no rules match
  return {
    reply:
      'আমি আপনার প্রশ্নটি বুঝতে পারিনি। আপনি আমাদের CEO, অফিস ঠিকানা, কোর্স, টুলস, পেমেন্ট বা ফ্রিল্যান্সিং আইডিয়া সম্পর্কে জানতে চাইতে পারেন।',
  };
}
