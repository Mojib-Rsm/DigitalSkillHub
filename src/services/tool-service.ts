

'use server';

import { getFirestore, collection, getDocs, orderBy, query, doc, updateDoc, addDoc, deleteDoc, limit as firestoreLimit, where, getDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

// The type is now imported from demo-data to keep it consistent
import type { Tool } from '@/lib/demo-data';


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

export async function getToolByHref(href: string): Promise<Tool | null> {
    const allTools = await getTools();
    return allTools.find(tool => tool.href === href) || null;
}

export async function getToolById(id: string): Promise<Tool | null> {
    try {
        const db = getFirestore(app);
        const toolRef = doc(db, 'tools', id);
        const toolSnapshot = await getDoc(toolRef);
        if (toolSnapshot.exists()) {
            return { id: toolSnapshot.id, ...toolSnapshot.data() } as Tool;
        }
        return null;
    } catch(error) {
        console.error(`Error fetching tool by ID: ${id}`, error);
        return null;
    }
}


export async function getRelatedTools(category: string, currentToolId: string): Promise<Tool[]> {
    const allTools = await getTools();
    return allTools
        .filter(tool => tool.category === category && tool.id !== currentToolId && tool.enabled)
        .slice(0, 3);
}


export async function getTrendingTools(limit: number = 4): Promise<Tool[]> {
    try {
        const db = getFirestore(app);
        
        // 1. Get all history items
        const historyCol = collection(db, 'history');
        const historySnapshot = await getDocs(historyCol);
        
        // 2. Count tool usage
        const toolUsage: Record<string, number> = {};
        historySnapshot.forEach(doc => {
            const toolId = doc.data().tool;
            if (toolId) {
                toolUsage[toolId] = (toolUsage[toolId] || 0) + 1;
            }
        });

        // 3. Get all available tools
        const allTools = await getTools();
        const enabledTools = allTools.filter(tool => tool.enabled);
        
        // Create a map of tool IDs (slugs) to tools for efficient lookup
        const toolMap = new Map<string, Tool>();
        for (const tool of enabledTools) {
             // The tool ID in history is the slug, e.g. "one-click-writer"
             // which is the end part of the href.
            const slug = tool.href.split('/').pop() || tool.id;
            if(!toolMap.has(slug)) {
                toolMap.set(slug, tool);
            }
        }

        // 4. Sort tool slugs by usage
        const sortedToolSlugs = Object.keys(toolUsage).sort((a, b) => {
            return toolUsage[b] - toolUsage[a];
        });

        // 5. Map sorted slugs back to tool objects and ensure they are unique and enabled
        const trendingTools: Tool[] = [];
        const addedTools = new Set<string>();

        for (const toolSlug of sortedToolSlugs) {
            if (trendingTools.length >= limit) break;
            
            const tool = toolMap.get(toolSlug);
            if (tool && !addedTools.has(tool.id)) {
                trendingTools.push(tool);
                addedTools.add(tool.id);
            }
        }
        
        // If there are not enough trending tools, fill with other enabled tools
        if (trendingTools.length < limit) {
             for (const tool of enabledTools) {
                if (trendingTools.length >= limit) break;
                if (!addedTools.has(tool.id)) {
                    trendingTools.push(tool);
                    addedTools.add(tool.id);
                }
            }
        }
        
        return trendingTools;

    } catch (error) {
        console.error("Error fetching trending tools:", error);
        // Fallback to fetching latest tools if history processing fails
        return (await getTools()).filter(t => t.enabled).slice(0, limit);
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
    

    
