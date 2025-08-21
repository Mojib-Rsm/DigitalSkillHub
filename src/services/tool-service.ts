
'use server';

import { getFirestore, collection, getDocs, orderBy, query, doc, updateDoc, addDoc, deleteDoc, limit as firestoreLimit } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export type Tool = {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: string;
    category: string;
    enabled: boolean;
};

let toolsCache: Tool[] | null = null;

export async function getTools(limit?: number): Promise<Tool[]> {
    // This function is called on public pages, so we can cache the result
    // to improve performance and reduce Firestore reads.
    // If a limit is applied, we don't cache as it's a specific subset.
    if (toolsCache && !limit) {
        return toolsCache;
    }

    try {
        const db = getFirestore(app);
        const toolsCol = collection(db, 'tools');
        
        const constraints = [orderBy('category')];
        if(limit) {
            constraints.push(firestoreLimit(limit));
        }

        const q = query(toolsCol, ...constraints);
        const toolSnapshot = await getDocs(q);
        
        if (toolSnapshot.empty) {
            console.warn("No tools found in Firestore. You may need to seed the database.");
            return [];
        }

        const toolList = toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
        
        if (!limit) {
             toolsCache = toolList; // Cache the fetched tools only if no limit
        }

        return toolList;
    } catch (error) {
        console.error("Error fetching tools from Firestore:", error);
        return [];
    }
}

export async function addTool(toolData: Omit<Tool, 'id'>) {
    try {
        const db = getFirestore(app);
        const toolsCol = collection(db, 'tools');
        const docRef = await addDoc(toolsCol, toolData);
        toolsCache = null; // Invalidate cache
        revalidatePath('/ai-tools');
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
        toolsCache = null; // Invalidate cache
        revalidatePath('/ai-tools');
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
        toolsCache = null; // Invalidate cache
        revalidatePath('/ai-tools');
        revalidatePath('/dashboard/admin/tools');
        return { success: true };
    } catch (error) {
        console.error("Error deleting tool:", error);
        return { success: false, message: (error as Error).message };
    }
}
