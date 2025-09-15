

'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';
import pool from '@/lib/mysql';
import { ResultSetHeader } from 'mysql2';

const RequestToolSchema = z.object({
    tool_name: z.string().min(5, "Tool name must be at least 5 characters."),
    tool_description: z.string().min(20, "Please provide a more detailed description."),
    use_case: z.string().min(20, "Please describe a use case."),
});


export async function requestToolAction(prevState: any, formData: FormData): Promise<{success: boolean, message: string}> {
    const user = await getCurrentUser();

    const validatedFields = RequestToolSchema.safeParse({
        tool_name: formData.get('tool_name'),
        tool_description: formData.get('tool_description'),
        use_case: formData.get('use_case'),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: validatedFields.error.errors.map(e => e.message).join(', ')
        };
    }
    
    try {
        const { tool_name, tool_description, use_case } = validatedFields.data;
        await pool.query<ResultSetHeader>(
            'INSERT INTO tool_requests (user_id, tool_name, tool_description, use_case) VALUES (?, ?, ?, ?)',
            [user?.id, tool_name, tool_description, use_case]
        );

        return { success: true, message: "Your tool request has been submitted successfully. We'll review it soon!" };
    } catch (error) {
        console.error("Error submitting tool request:", error);
        return { success: false, message: "An unexpected error occurred. Please try again later." };
    }
}
