
'use server';

import { getCurrentUser } from './user-service';
import pool from '@/lib/mysql';
import { RowDataPacket } from 'mysql2';
import { HistoryModel } from '@/models/historyModel';

export type HistoryItem = {
  id: string;
  tool: string;
  input: any;
  output: any;
  createdAt: string;
  uid?: number; // Add uid to be able to fetch user info for admin view
  userName?: string;
  userImage?: string;
};

export async function getHistory(): Promise<HistoryItem[]> {
  const user = await getCurrentUser();
  
  if (!user) {
    console.warn("Cannot get history: user is not logged in.");
    return [];
  }

  try {
    const historyRows = await HistoryModel.getHistory(user.id, user.role === 'admin');
    
    return historyRows.map(row => ({
        id: row.id.toString(),
        tool: row.tool,
        input: JSON.parse(row.input),
        output: JSON.parse(row.output),
        createdAt: new Date(row.created_at).toISOString(),
        uid: row.user_id,
        userName: row.userName,
        userImage: row.userImage,
    }));

  } catch (error) {
    console.error('Failed to get history from MySQL:', error);
    return [];
  }
}
