
import pool from "@/lib/mysql";
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { Coupon } from "@/services/coupon-service";

export const CouponModel = {
  async getAll(): Promise<RowDataPacket[]> {
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM coupons ORDER BY code");
    return rows;
  },
  
  async getActive(): Promise<RowDataPacket[]> {
     const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM coupons WHERE isActive = 1 AND (validUntil IS NULL OR validUntil > NOW())'
     );
    return rows;
  },

  async create(couponData: Omit<Coupon, 'id'>): Promise<number> {
     const dataToInsert = {
        ...couponData,
        applicableTo: Array.isArray(couponData.applicableTo) ? JSON.stringify(couponData.applicableTo) : couponData.applicableTo
    };
    const [result] = await pool.query<ResultSetHeader>("INSERT INTO coupons SET ?", [dataToInsert]);
    return result.insertId;
  },
  
  async update(id: string, couponData: Partial<Omit<Coupon, 'id'>>): Promise<boolean> {
     const dataToUpdate = {
        ...couponData,
        applicableTo: Array.isArray(couponData.applicableTo) ? JSON.stringify(couponData.applicableTo) : couponData.applicableTo
    };
    const [result] = await pool.query<ResultSetHeader>("UPDATE coupons SET ? WHERE id = ?", [dataToUpdate, id]);
    return result.affectedRows > 0;
  },
  
  async delete(id: string): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>("DELETE FROM coupons WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
};
