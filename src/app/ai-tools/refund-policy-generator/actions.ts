
"use server";

import { refundPolicyGenerator } from "@/ai/flows/refund-policy-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const RefundPolicyActionSchema = z.object({
  companyName: z.string().min(3, { message: "অনুগ্রহ করে একটি কোম্পানির নাম লিখুন।" }),
  refundTimeframe: z.string().min(1, { message: "অনুগ্রহ করে একটি রিফান্ডের সময়সীমা দিন।" }),
  productType: z.string().min(3, { message: "অনুগ্রহ করে পণ্যের ধরন উল্লেখ করুন।" }),
  conditions: z.string().min(10, { message: "অনুগ্রহ করে রিফান্ডের শর্তাবলী বর্ণনা করুন।" }),
  contactEmail: z.string().email({ message: "অনুগ্রহ করে একটি বৈধ ইমেল ঠিকানা দিন।" }),
});

type FormState = {
  message: string;
  policy?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateRefundPolicy(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = RefundPolicyActionSchema.safeParse({
    companyName: formData.get("companyName"),
    refundTimeframe: formData.get("refundTimeframe"),
    productType: formData.get("productType"),
    conditions: formData.get("conditions"),
    contactEmail: formData.get("contactEmail"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  try {
    const result = await refundPolicyGenerator(validatedFields.data);
    if (result.policy) {
      await saveHistoryAction({
          tool: 'refund-policy-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        policy: result.policy,
      };
    } else {
        return { message: "পলিসি তৈরি করতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।" }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}
