
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

export type Tool = {
    id: string;
    title: string;
    description: string;
    href: string;
    icon: string; // Storing icon name as string
    category: string;
};

let toolsCache: Tool[] | null = null;

export async function getTools(): Promise<Tool[]> {
    if (toolsCache) {
        return toolsCache;
    }

    try {
        const db = getFirestore(app);
        const toolsCol = collection(db, 'tools');
        const toolSnapshot = await getDocs(toolsCol);
        
        if (toolSnapshot.empty) {
            console.warn("No tools found in Firestore. You may need to seed the database.");
            return [];
        }

        const toolList = toolSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tool));
        toolsCache = toolList;
        return toolList;
    } catch (error) {
        console.error("Error fetching tools from Firestore:", error);
        return [];
    }
}
