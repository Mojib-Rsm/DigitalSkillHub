
'use server';

import type { Tool as DemoTool } from '@/lib/demo-data';
import { tools as demoTools } from '@/lib/demo-data';
import pool from '@/lib/db';

export type Tool = DemoTool;


// --- Public-facing functions use PostgreSQL ---

async function mapRowsToTools(rows: any[]): Promise<Tool[]> {
    return rows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        description: row.description,
        href: row.href,
        icon: row.icon,
        category: row.category,
        enabled: !!row.enabled,
        isFree: !!row.isfree,
        credits: row.credits,
    }));
}

export async function getTools(limit?: number): Promise<Tool[]> {
    try {
        let query = 'SELECT * FROM tools ORDER BY title';
        const params = [];
        if (limit) {
            query += ` LIMIT $1`;
            params.push(limit);
        }
        const result = await pool.query(query, params);
        if (result.rows.length === 0) {
            return (demoTools as Tool[]).filter(t => t.enabled);
        }
        return mapRowsToTools(result.rows);
    } catch (error) {
        console.error("Error fetching tools from PostgreSQL. Falling back to demo data.", error);
        return (demoTools as Tool[]).filter(t => t.enabled);
    }
}

export async function getToolByHref(href: string): Promise<Tool | null> {
    try {
        const result = await pool.query('SELECT * FROM tools WHERE href = $1', [href]);
        if (result.rows.length > 0) {
            const tools = await mapRowsToTools(result.rows);
            return tools[0];
        }
        return (demoTools as Tool[]).find(t => t.href === href) || null;
    } catch (error) {
        console.error(`Error fetching tool with href ${href} from PostgreSQL. Falling back to demo data.`, error);
        return (demoTools as Tool[]).find(t => t.href === href) || null;
    }
}

export async function getToolByTitle(title: string): Promise<Tool | null> {
    try {
        const result = await pool.query('SELECT * FROM tools WHERE title = $1', [title]);
        if (result.rows.length > 0) {
            const tools = await mapRowsToTools(result.rows);
            return tools[0];
        }
        return (demoTools as Tool[]).find(t => t.title === title) || null;
    } catch (error) {
        console.error(`Error fetching tool with title ${title} from PostgreSQL. Falling back to demo data.`, error);
        return (demoTools as Tool[]).find(t => t.title === title) || null;
    }
}

export async function getToolById(id: string): Promise<Tool | null> {
    try {
        const result = await pool.query('SELECT * FROM tools WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            const tools = await mapRowsToTools(result.rows);
            return tools[0];
        }
         // @ts-ignore
        return (demoTools as Tool[]).find(t => t.id === id) || null;
    } catch (error) {
        console.error(`Error fetching tool with id ${id} from PostgreSQL. Falling back to demo data.`, error);
        // @ts-ignore
        return (demoTools as Tool[]).find(t => t.id === id) || null;
    }
}

export async function getRelatedTools(category: string, currentToolId: string): Promise<Tool[]> {
    try {
        const result = await pool.query(
            'SELECT * FROM tools WHERE category = $1 AND id != $2 AND enabled = TRUE LIMIT 3',
            [category, currentToolId]
        );
        if (result.rows.length > 0) {
            return mapRowsToTools(result.rows);
        }
        return (demoTools as Tool[]).filter(t => t.category === category && t.id !== currentToolId && t.enabled).slice(0, 3);
    } catch (error) {
        console.error(`Error fetching related tools for category ${category} from PostgreSQL. Falling back to demo data.`, error);
        return (demoTools as Tool[]).filter(t => t.category === category && t.id !== currentToolId && t.enabled).slice(0, 3);
    }
}

export async function getTrendingTools(limit: number = 4): Promise<Tool[]> {
    // A more complex logic could be implemented here (e.g., using a usage_count column)
    try {
        const result = await pool.query(
            'SELECT * FROM tools WHERE enabled = TRUE ORDER BY id DESC LIMIT $1',
            [limit]
        );
        if (result.rows.length > 0) {
            return mapRowsToTools(result.rows);
        }
        return (demoTools as Tool[]).slice(0, limit);
    } catch (error) {
        console.error("Error fetching trending tools from PostgreSQL. Falling back to demo data.", error);
        return (demoTools as Tool[]).slice(0, limit);
    }
}


// --- Admin functions still interact with PostgreSQL to allow management ---

export async function addTool(toolData: Omit<Tool, 'id'>) {
    try {
        const { title, description, href, icon, category, enabled, isFree, credits } = toolData;
        const result = await pool.query(
            'INSERT INTO tools (title, description, href, icon, category, enabled, isFree, credits) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            [title, description, href, icon, category, enabled, isFree, credits]
        );
        return { success: true, id: result.rows[0].id.toString() };
    } catch (error) {
        console.error("Error adding tool to PostgreSQL:", error);
        return { success: false, message: (error as Error).message };
    }
}

export async function updateTool(toolId: string, toolData: Partial<Omit<Tool, 'id'>>) {
    try {
        const entries = Object.entries(toolData).filter(([_, v]) => v !== undefined);
        const setClause = entries.map(([key], i) => `"${key.toLowerCase()}" = $${i + 2}`).join(', ');
        const values = entries.map(([_, v]) => v);

        if (entries.length === 0) return { success: true };

        await pool.query(`UPDATE tools SET ${setClause} WHERE id = $1`, [toolId, ...values]);
        return { success: true };
    } catch (error) {
        console.error("Error updating tool in PostgreSQL:", error);
        return { success: false, message: (error as Error).message };
    }
}

export async function deleteTool(toolId: string) {
    try {
        await pool.query('DELETE FROM tools WHERE id = $1', [toolId]);
        return { success: true };
    } catch (error) {
        console.error("Error deleting tool from PostgreSQL:", error);
        return { success: false, message: (error as Error).message };
    }
}
