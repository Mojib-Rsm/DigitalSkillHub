
'use server';

import type { Tool } from '@/lib/demo-data';
import pool from '@/lib/mysql';
import { RowDataPacket } from 'mysql2';

// --- Public-facing functions use MySQL ---

async function mapRowsToTools(rows: RowDataPacket[]): Promise<Tool[]> {
    return rows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        href: row.href,
        icon: row.icon,
        category: row.category,
        enabled: !!row.enabled,
        isFree: !!row.isFree,
        credits: row.credits,
    }));
}

export async function getTools(limit?: number): Promise<Tool[]> {
    try {
        let queryString = 'SELECT * FROM tools ORDER BY title';
        if (limit) {
            queryString += ` LIMIT ${limit}`;
        }
        const [rows] = await pool.query<RowDataPacket[]>(queryString);
        return mapRowsToTools(rows);
    } catch (error) {
        console.error("Error fetching tools from MySQL:", error);
        return [];
    }
}

export async function getToolByHref(href: string): Promise<Tool | null> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tools WHERE href = ?', [href]);
        if (rows.length > 0) {
            const tools = await mapRowsToTools(rows);
            return tools[0];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching tool with href ${href} from MySQL:`, error);
        return null;
    }
}

export async function getToolByTitle(title: string): Promise<Tool | null> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tools WHERE title = ?', [title]);
        if (rows.length > 0) {
            const tools = await mapRowsToTools(rows);
            return tools[0];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching tool with title ${title} from MySQL:`, error);
        return null;
    }
}

export async function getToolById(id: string): Promise<Tool | null> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tools WHERE id = ?', [id]);
        if (rows.length > 0) {
            const tools = await mapRowsToTools(rows);
            return tools[0];
        }
        return null;
    } catch (error) {
        console.error(`Error fetching tool with id ${id} from MySQL:`, error);
        return null;
    }
}

export async function getRelatedTools(category: string, currentToolId: string): Promise<Tool[]> {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM tools WHERE category = ? AND id != ? AND enabled = 1 LIMIT 3',
            [category, currentToolId]
        );
        return mapRowsToTools(rows);
    } catch (error) {
        console.error(`Error fetching related tools for category ${category} from MySQL:`, error);
        return [];
    }
}

export async function getTrendingTools(limit: number = 4): Promise<Tool[]> {
    // A more complex logic could be implemented here (e.g., using a usage_count column)
    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM tools WHERE enabled = 1 ORDER BY id DESC LIMIT ?',
            [limit]
        );
        return mapRowsToTools(rows);
    } catch (error) {
        console.error("Error fetching trending tools from MySQL:", error);
        return [];
    }
}


// --- Admin functions still interact with MySQL to allow management ---

export async function addTool(toolData: Omit<Tool, 'id'>) {
    try {
        const [result] = await pool.query('INSERT INTO tools SET ?', [toolData]);
        return { success: true, id: (result as any).insertId.toString() };
    } catch (error) {
        console.error("Error adding tool to MySQL:", error);
        return { success: false, message: (error as Error).message };
    }
}

export async function updateTool(toolId: string, toolData: Partial<Omit<Tool, 'id'>>) {
    try {
        await pool.query('UPDATE tools SET ? WHERE id = ?', [toolData, toolId]);
        return { success: true };
    } catch (error) {
        console.error("Error updating tool in MySQL:", error);
        return { success: false, message: (error as Error).message };
    }
}

export async function deleteTool(toolId: string) {
    try {
        await pool.query('DELETE FROM tools WHERE id = ?', [toolId]);
        return { success: true };
    } catch (error) {
        console.error("Error deleting tool from MySQL:", error);
        return { success: false, message: (error as Error).message };
    }
}
