
'use server';

import pool from "@/lib/mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { Testimonial } from "@/services/testimonial-service";

export const TestimonialModel = {
  async getAll(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM testimonials ORDER BY authorName");
    return rows;
  },
  
  async create(testimonialData: Omit<Testimonial, 'id'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>("INSERT INTO testimonials SET ?", [testimonialData]);
    return result.insertId;
  },
  
  async update(id: string, testimonialData: Partial<Omit<Testimonial, 'id'>>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>("UPDATE testimonials SET ? WHERE id = ?", [testimonialData, id]);
    return result.affectedRows > 0;
  },
  
  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM testimonials WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
};
