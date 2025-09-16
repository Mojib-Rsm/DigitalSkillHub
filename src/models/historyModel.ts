
import pool from "@/lib/db";

type HistoryData = {
    user_id: number;
    tool: string;
    input: object;
    output: object;
};

export const HistoryModel = {
  async create(historyData: HistoryData): Promise<number> {
    const { user_id, tool, input, output } = historyData;
    const result = await pool.query(
      "INSERT INTO history (user_id, tool, input, output) VALUES ($1, $2, $3, $4) RETURNING id",
      [user_id, tool, input, output]
    );
    return result.rows[0].id;
  },

  async getHistory(userId: number, isAdmin: boolean): Promise<any[]> {
    if (isAdmin) {
        const result = await pool.query(`
            SELECT h.*, u.name as userName, u.profile_image as userImage 
            FROM history h
            LEFT JOIN users u ON h.user_id = u.id
            ORDER BY h.created_at DESC 
            LIMIT 100
        `);
        return result.rows;
    } else {
        const result = await pool.query(
            "SELECT * FROM history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
            [userId]
        );
        return result.rows;
    }
  }
};
