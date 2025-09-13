import pool from "@/lib/mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// Define the User type based on your DB schema
export type User = {
    id?: number;
    name: string;
    email: string;
    password?: string; // Password might be sensitive and not always fetched
    role?: 'admin' | 'user';
    credits?: number;
    profile_image?: string;
    status?: 'active' | 'banned';
    plan_id?: string;
    bookmarks?: string;
    created_at?: Date;
    phone?: string;
};

export const UserModel = {
  async create(user: Omit<User, 'id'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [user.name, user.email, user.password]
    );
    return result.insertId;
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] as User | undefined;
  },

  async findById(id: number): Promise<User | undefined> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] as User | undefined;
  },
};
