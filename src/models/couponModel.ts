
import pool from "@/lib/db";
import type { Coupon } from "@/services/coupon-service";

export const CouponModel = {
  async getAll(): Promise<any[]> {
    const result = await pool.query("SELECT * FROM coupons ORDER BY code");
    return result.rows;
  },
  
  async getActive(): Promise<any[]> {
     const result = await pool.query(
        'SELECT * FROM coupons WHERE isActive = TRUE AND (validUntil IS NULL OR validUntil > NOW())'
     );
    return result.rows;
  },

  async create(couponData: Omit<Coupon, 'id'>): Promise<number> {
    const { code, description, discountPercentage, isActive, validUntil, applicableTo } = couponData;
    const result = await pool.query(
        "INSERT INTO coupons (code, description, discountPercentage, isActive, validUntil, applicableTo) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
        [code, description, discountPercentage, isActive, validUntil, applicableTo]
    );
    return result.rows[0].id;
  },
  
  async update(id: string, couponData: Partial<Omit<Coupon, 'id'>>): Promise<boolean> {
    const entries = Object.entries(couponData).filter(([_, v]) => v !== undefined);
    const setClause = entries.map(([key], i) => `${key} = $${i + 2}`).join(', ');
    const values = entries.map(([_, v]) => v);
    
    if (entries.length === 0) return true;

    const result = await pool.query(
        `UPDATE coupons SET ${setClause} WHERE id = $1`,
        [id, ...values]
    );
    return result.rowCount > 0;
  },
  
  async delete(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM coupons WHERE id = $1", [id]);
    return result.rowCount > 0;
  }
};
