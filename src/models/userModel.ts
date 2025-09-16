
import pool from "@/lib/db";

// Define the User type based on your DB schema
export type User = {
    id?: number;
    name: string;
    email: string;
    password?: string; // Password might be sensitive and not always fetched
    profile_image?: string | null;
    role?: 'admin' | 'user';
    credits?: number;
    status?: 'active' | 'banned';
    plan_id?: string;
    bookmarks?: object;
    created_at?: Date;
    phone?: string;
};

export const UserModel = {
  async create(user: Omit<User, 'id'>): Promise<number> {
    const { name, email, password, profile_image, role, plan_id } = user;
    const result = await pool.query(
      "INSERT INTO users (name, email, password, profile_image, role, plan_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [name, email, password, profile_image, role, plan_id]
    );
    return result.rows[0].id;
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] as User | undefined;
  },

  async findById(id: number): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] as User | undefined;
  },
};
