
'use server';

import { z } from 'zod';

const SmsApiSchema = z.object({
  api_key: z.string(),
  senderid: z.string(),
  number: z.string(),
  message: z.string(),
});

type SmsApiResponse = {
    "code": string,
    "message": string
}

export async function sendSms(phoneNumber: string, message: string): Promise<{success: boolean, message: string}> {
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID;

  if (!apiKey || !senderId) {
    console.error("SMS API Key or Sender ID is not configured in environment variables.");
    return { success: false, message: "SMS gateway is not configured." };
  }

  const validatedData = SmsApiSchema.safeParse({
    api_key: apiKey,
    senderid: senderId,
    number: phoneNumber,
    message: message,
  });

  if (!validatedData.success) {
     console.error("SMS API data validation failed:", validatedData.error);
     return { success: false, message: "Invalid data for sending SMS." };
  }

  try {
    const response = await fetch('http://bulksmsbd.net/api/smsapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData.data),
    });
    
    const result:SmsApiResponse = await response.json();

    if (result.code === "ok") {
        console.log("SMS sent successfully to:", phoneNumber);
        return { success: true, message: "SMS sent successfully." };
    } else {
        console.error("Failed to send SMS:", result.message);
        return { success: false, message: `Failed to send SMS: ${result.message}` };
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    if (error instanceof Error) {
        return { success: false, message: `An unexpected error occurred: ${error.message}`};
    }
    return { success: false, message: 'An unexpected error occurred while sending SMS.' };
  }
}
