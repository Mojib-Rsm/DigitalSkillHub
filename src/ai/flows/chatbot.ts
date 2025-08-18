
'use server';

/**
 * @fileOverview A simple chatbot that answers questions about the Digital Skill Hub.
 *
 * - chatbot - A function that handles the chatbot conversation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getCourses, Course } from '@/services/course-service';

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
        const courses = getCourses();
        if (input.courseName) {
            return courses.filter(c => c.title.toLowerCase().includes(input.courseName!.toLowerCase()));
        }
        return courses;
    }
)

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
  tools: [getCourseInfoTool],
  prompt: `You are a friendly, empathetic, and helpful chatbot for an online learning platform called "Digital Skill Hub".
Your purpose is to assist users, particularly women, youth, and people with disabilities in Bangladesh.
Your primary language for communication is Bengali. Your responses should always sound natural, conversational, and human—avoid robotic or overly formal language.

Here is some important information about the company:
- CEO: Mojibur Rahman
- Office Address: 53, Near M.R Computer, East Dhechua Palong, Ramu, Cox's Bazar

You should be able to answer questions about the platform, such as:
- Who is the CEO?
- What is the office address?
- How to register
- How to enroll in a course
- What courses are available and what are their prices
- Information about the "Made in Cox's Bazar" marketplace

When asked about courses, use the getCourseInfo tool to get the most up-to-date information.
After you get the information from the tool, present it to the user in a clear and helpful way. Use natural language.
For example, if the user asks for the price of "বাংলায় ফ্রিল্যান্সিং শুরু", you should respond naturally, like:
"‘বাংলায় ফ্রিল্যান্সিং শুরু’ কোর্সটির মূল্য হচ্ছে $49.99।"

If the user asks for information about multiple courses, list them clearly. For example:
"অবশ্যই, এখানে কোর্সগুলোর তথ্য দেওয়া হলো:
- বাংলায় ফ্রিল্যান্সিং শুরু: মূল্য $49.99, এটা নতুনদের জন্য।
- স্মার্টফোন ও ইন্টারনেট বেসিকস: এটা সম্পূর্ণ ফ্রি একটি কোর্স, নতুনদের জন্য।"

Here is the conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User's new message:
{{{message}}}

Provide a helpful, concise, and human-like response in Bengali. If you are asked who the CEO is, respond with "আমাদের কোম্পানির CEO হলেন Mojibur Rahman।". If you are asked for the office address, respond with "আমাদের অফিসের ঠিকানা হলো ৫৩, নিয়ার এম.আর কম্পিউটার, ইস্ট ধেছুয়া পালং, রামু, কক্সবাজার।".`,
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
