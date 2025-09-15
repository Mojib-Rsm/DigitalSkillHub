
'use server';

import pool from '@/lib/mysql';

export async function checkDbConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const connection = await pool.getConnection();
    connection.release();
    return { success: true, message: 'Database connected successfully.' };
  } catch (error: any) {
    console.error("Database connection check failed:", error);
    return { success: false, message: `Failed to connect to the database. Error: ${error.message}` };
  }
}
