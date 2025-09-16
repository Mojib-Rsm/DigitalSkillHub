
'use server';

/**
 * @fileOverview A simple chatbot that answers questions about the Digital Skill Hub.
 *
 * - chatbot - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getCourses, Course } from '@/services/course-service';
import { freelanceIdeaGenerator } from './freelance-idea-generator';

const getCourseInfoTool = ai.defineTool(
    {
        name: 'getCourseInfo',
        description: 'Get information about available courses on the Digital Skill Hub platform. Use this to answer questions about course names, prices, categories, and other details.',
        inputSchema: z.object({
            courseName: z.string().optional().describe('The name of the course to get information about. If not provided, information about all courses will be returned.'),
        }),
        outputSchema: z.array(z.custom<Course>()),
    },
    async (input) => {
        const courses = await getCourses();
        if (input.courseName) {
            return courses.filter(c => c.title.toLowerCase().includes(input.courseName!.toLowerCase()));
        }
        return courses;
    }
);

const getFreelanceIdeasTool = ai.defineTool(
    {
        name: 'getFreelanceIdeas',
        description: 'Suggest freelance project ideas based on a user\'s skills. Use this when the user asks for freelance ideas, what they can do with their skills, or how to start freelancing.',
        inputSchema: z.object({
            skills: z.string().describe('A comma-separated list of the user\'s skills.'),
        }),
        outputSchema: z.object({
            ideas: z.array(z.object({
                title: z.string(),
                description: z.string(),
            })),
        }),
    },
    async (input) => {
        return freelanceIdeaGenerator(input);
    }
);


const ChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe("The conversation history."),
  message: z.string().describe("The user's latest message."),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  reply: z.string().describe('The chatbot\'s reply in Bengali.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function chatbot(input: ChatbotInput): Promise<ChatbotOutput> {
  return chatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  tools: [getCourseInfoTool, getFreelanceIdeasTool],
  prompt: `You are a friendly, empathetic, and helpful chatbot for an online learning platform called "TotthoAi".
Your purpose is to assist users, particularly women, youth, and people with disabilities in Bangladesh.
Your primary language for communication is Bengali. Your responses should always sound natural, conversational, and human—avoid robotic or overly formal language.

Here is some important information about the company:
- CEO: Mojibur Rahman
- Office Address: Vill: Dariardighi, Ward- 01, Post: Rabita- 4700, Upazila: Ramu, Dist: Cox’s Bazar.

You should be able to answer questions about the platform, such as:
- Who is the CEO?
- What is the office address?
- How to register
- How to enroll in a course
- What courses are available and what are their prices
- Information about the "Made in Cox's Bazar" marketplace
- Suggest freelance ideas based on user skills.

When asked about courses, use the getCourseInfo tool to get the most up-to-date information.
When a user asks for freelance ideas based on their skills (e.g., "I know graphic design, what can I do?"), use the getFreelanceIdeas tool.

After you get information from a tool, present it to the user in a clear, helpful, and natural-sounding Bengali.

For example, if the user asks for the price of "বাংলায় ফ্রিল্যান্সিং শুরু", you should respond naturally, like:
"‘বাংলায় ফ্রিল্যান্সিং শুরু’ কোর্সটির মূল্য হচ্ছে $49.99।"

If you get freelance ideas, present them in a list format, like:
"আপনার দক্ষতার উপর ভিত্তি করে, এখানে কিছু ফ্রিল্যান্স কাজের আইডিয়া দেওয়া হলো:
- **আইডিয়ার শিরোনাম:** আইডিয়ার বর্ণনা।
- **আইডিয়ার শিরোনাম:** আইডিয়ার বর্ণনা।"

Here is the conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User's new message:
{{{message}}}

Provide a helpful, concise, and human-like response in Bengali. If you are asked who the CEO is, respond with "আমাদের কোম্পানির CEO হলেন Mojibur Rahman।". If you are asked for the office address, respond with "আমাদের অফিসের ঠিকানা হলো গ্রাম: দরিয়ারদিঘী, ওয়ার্ড নং- ০১, ডাকঘর: রাবিতা- ৪৭০০, উপজেলা: রামু, জেলা: কক্সবাজার।".`,
});

const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
