"use server";

import { z } from 'zod';
import pool from '@/lib/mysql';
import bcryptjs from 'bcryptjs';
import { redirect } from 'next/navigation';

const SetupSchema = z.object({
    language: z.string(),
    photo_size: z.string(),
    bg_color: z.string(),
    max_file_size: z.number(),
    allowed_formats: z.array(z.string()),
    storage_provider: z.string(),
    admin_name: z.string().min(3, "Admin name must be at least 3 characters."),
    admin_email: z.string().email("Please enter a valid email."),
    admin_password: z.string().min(8, "Password must be at least 8 characters."),
    confirm_password: z.string(),
}).refine(data => data.admin_password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
});

export async function finishSetupAction(data: z.infer<typeof SetupSchema>) {
    const validatedFields = SetupSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            issues: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const { admin_name, admin_email, admin_password, ...settings } = validatedFields.data;
        
        // 1. Save settings to the database
        const settingsToSave = [
            ['language', settings.language],
            ['photo_size_standard', settings.photo_size],
            ['default_background_color', settings.bg_color],
            ['max_upload_size_mb', settings.max_file_size.toString()],
            ['allowed_formats', JSON.stringify(settings.allowed_formats)],
            ['storage_provider', settings.storage_provider],
        ];

        for (const [key, value] of settingsToSave) {
            await pool.query(
                'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, value, value]
            );
        }

        // 2. Create the admin user
        const existingAdmin = await pool.query<any[]>("SELECT * FROM users WHERE role = 'admin'");
        if (existingAdmin[0].length > 0) {
             return { success: false, message: "An admin user already exists." };
        }
        
        const hashedPassword = await bcryptjs.hash(admin_password, 10);
        await pool.query(
            "INSERT INTO users (name, email, password, role, credits, plan_id) VALUES (?, ?, ?, ?, ?, ?)",
            [admin_name, admin_email, hashedPassword, 'admin', 9999, 'sigma']
        );

    } catch (error) {
        console.error("Setup failed:", error);
        return { success: false, message: (error as Error).message };
    }
    
    // 3. Redirect to dashboard
    redirect('/dashboard');

    // This part is not reachable due to redirect, but good for type consistency
    return { success: true, message: "Setup completed successfully." };
}