
'use server';

import { getFirestore, collection, getDocs, orderBy, query, doc, updateDoc, addDoc, deleteDoc, limit as firestoreLimit, where, getDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import { tools as staticTools } from '@/lib/demo-data'; // Import static data
import type { Tool } from '@/lib/demo-data';

// --- Public-facing functions use static data ---

export async function getTools(limit?: number): Promise<Tool[]> {
    // Directly return the static data from demo-data.ts
    // This avoids any Firestore read operations for public-facing pages.
    const tools = staticTools;
    if (limit) {
        return tools.slice(0, limit);
    }
    return tools;
}

export async function getToolByHref(href: string): Promise<Tool | null> {
    const allTools = await getTools();
    return allTools.find(tool => tool.href === href) || null;
}

export async function getToolById(id: string): Promise<Tool | null> {
    const allTools = await getTools();
    return allTools.find(tool => tool.id === id) || null;
}

export async function getRelatedTools(category: string, currentToolId: string): Promise<Tool[]> {
    const allTools = await getTools();
    return allTools
        .filter(tool => tool.category === category && tool.id !== currentToolId && tool.enabled)
        .slice(0, 3);
}

export async function getTrendingTools(limit: number = 4): Promise<Tool[]> {
    const allTools = await getTools();
    // For now, we'll return a slice of the static tools as "trending"
    // A more complex logic could be implemented here if needed, without db access.
    return allTools.filter(t => t.enabled).slice(0, limit);
}


// --- Admin functions still interact with Firestore to allow management ---

export async function addTool(toolData: Omit<Tool, 'id'>) {
    try {
        const db = getFirestore(app);
        const toolsCol = collection(db, 'tools');
        const docRef = await addDoc(toolsCol, toolData);
        revalidatePath('/dashboard/admin/tools');
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding tool:", error);
        return { success: false, message: (error as Error).message };
    }
}

export async function updateTool(toolId: string, toolData: Partial<Omit<Tool, 'id'>>) {
    try {
        const db = getFirestore(app);
        const toolRef = doc(db, 'tools', toolId);
        await updateDoc(toolRef, toolData);
        revalidatePath('/dashboard/admin/tools');
        return { success: true };
    } catch (error) {
        console.error("Error updating tool:", error);
        return { success: false, message: (error as Error).message };
    }
}

export async function deleteTool(toolId: string) {
    try {
        const db = getFirestore(app);
        const toolRef = doc(db, 'tools', toolId);
        await deleteDoc(toolRef);
        revalidatePath('/dashboard/admin/tools');
        return { success: true };
    } catch (error) {
        console.error("Error deleting tool:", error);
        return { success: false, message: (error as Error).message };
    }
}
