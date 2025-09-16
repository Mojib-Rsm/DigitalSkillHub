
'use server';

import pool from "@/lib/db";
import type { Testimonial } from "@/services/testimonial-service";

export const TestimonialModel = {
  async getAll(): Promise<any[]> {
    const result = await pool.query("SELECT * FROM testimonials ORDER BY authorName");
    return result.rows;
  },
  
  async create(testimonialData: Omit<Testimonial, 'id'>): Promise<number> {
    const { feature, quote, metric, authorName, authorRole, avatar, dataAiHint } = testimonialData;
    const result = await pool.query(
        "INSERT INTO testimonials (feature, quote, metric, authorName, authorRole, avatar, dataAiHint) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
        [feature, quote, metric, authorName, authorRole, avatar, dataAiHint]
    );
    return result.rows[0].id;
  },
  
  async update(id: string, testimonialData: Partial<Omit<Testimonial, 'id'>>): Promise<boolean> {
    const entries = Object.entries(testimonialData).filter(([_, v]) => v !== undefined);
    const setClause = entries.map(([key], i) => `"${key}" = $${i + 2}`).join(', ');
    const values = entries.map(([_, v]) => v);

    if (entries.length === 0) return true;

    const result = await pool.query(
        `UPDATE testimonials SET ${setClause} WHERE id = $1`,
        [id, ...values]
    );
    return result.rowCount > 0;
  },
  
  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM testimonials WHERE id = $1", [id]);
    return result.rowCount > 0;
  }
};
