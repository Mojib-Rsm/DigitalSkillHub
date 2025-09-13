
import pool from "@/lib/mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

type HistoryData = {
    user_id: number;
    tool: string;
    input: string; // JSON string
    output: string; // JSON string
};

export const HistoryModel = {
  async create(historyData: HistoryData): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO history (user_id, tool, input, output) VALUES (?, ?, ?, ?)",
      [historyData.user_id, historyData.tool, historyData.input, historyData.output]
    );
    return result.insertId;
  },

  async getHistory(userId: number, isAdmin: boolean): Promise<RowDataPacket[]> {
    if (isAdmin) {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT h.*, u.name as userName, u.profile_image as userImage 
            FROM history h
            LEFT JOIN users u ON h.user_id = u.id
            ORDER BY h.created_at DESC 
            LIMIT 100
        `);
        return rows;
    } else {
        const [rows] = await pool.query<RowDataPacket[]>(
            "SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
            [userId]
        );
        return rows;
    }
  }
};
