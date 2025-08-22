

'use server';

import { getFirestore, collection, getDocs, orderBy, query, doc, updateDoc, addDoc, deleteDoc, limit as firestoreLimit, where } from 'firebase/firestore/lite';
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

export async function getToolByHref(href: string): Promise<Tool | null> {
    const allTools = await getTools();
    return allTools.find(tool => tool.href === href) || null;
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
                // The toolId in history is the href, so we need to map it to the tool's ID
                const toolHref = `/ai-tools/${toolId}`;
                 toolUsage[toolHref] = (toolUsage[toolHref] || 0) + 1;
            }
        });

        // 3. Get all available tools
        const allTools = await getTools();
        const enabledTools = allTools.filter(tool => tool.enabled);

        // 4. Sort tools by usage
        const sortedTools = enabledTools.sort((a, b) => {
            const usageA = toolUsage[a.href] || 0;
            const usageB = toolUsage[b.href] || 0;
            return usageB - usageA;
        });

        // 5. Return the top N tools
        return sortedTools.slice(0, limit);

    } catch (error) {
        console.error("Error fetching trending tools:", error);
        // Fallback to fetching latest tools if history processing fails
        return getTools(limit);
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

export const tools = [
    {
        id: "one-click-writer",
        title: "One-Click Writer",
        description: "Generate a full, SEO-optimized blog post from a single title.",
        href: "/ai-tools/one-click-writer",
        icon: "Sparkles",
        category: "Content & Writing",
        enabled: true,
    },
    {
        id: "blog-topic-generator",
        title: "ব্লগ টপিক জেনারেটর",
        description: "আপনার আগ্রহের উপর ভিত্তি করে সৃজনশীল ব্লগ পোস্টের ধারণা তৈরি করুন।",
        href: "/ai-tools/blog-topic-generator",
        icon: "PenSquare",
        category: "Content & Writing",
        enabled: true,
    },
    {
        id: "product-description-generator",
        title: "পণ্যের বিবরণ জেনারেটর",
        description: "আপনার ই-কমার্স পণ্যের জন্য আকর্ষণীয় বিবরণ তৈরি করুন।",
        href: "/ai-tools/product-description-generator",
        icon: "ShoppingCart",
        category: "Content & Writing",
        enabled: true,
    },
    {
        id: "social-media-post-generator",
        title: "সোশ্যাল মিডিয়া পোস্ট জেনারেটর",
        description: "ফেসবুক, ইনস্টাগ্রাম এবং আরও অনেক কিছুর জন্য আকর্ষণীয় পোস্ট তৈরি করুন।",
        href: "/ai-tools/social-media-post-generator",
        icon: "Hash",
        category: "Content & Writing",
        enabled: true,
    },
    {
        id: "facebook-comment-generator",
        title: "ফেসবুক কমেন্ট জেনারেটর",
        description: "যেকোনো ফেসবুক পোস্টের জন্য প্রাসঙ্গিক কমেন্ট এবং রিপ্লাই তৈরি করুন।",
        href: "/ai-tools/facebook-comment-generator",
        icon: "MessageSquare",
        category: "Content & Writing",
        enabled: true,
    },
    {
        id: "messenger-reply-generator",
        title: "মেসেঞ্জার রিপ্লাই জেনারেটর",
        description: "যেকোনো মেসেঞ্জার কথোপকথনের জন্য প্রাসঙ্গিক উত্তর তৈরি করুন।",
        href: "/ai-tools/messenger-reply-generator",
        icon: "MessageSquare",
        category: "Content & Writing",
        enabled: true,
    },
    {
        id: "cover-letter-generator",
        title: "কভার লেটার জেনারেটর",
        description: "কয়েক সেকেন্ডের মধ্যে একটি পেশাদার কভার লেটার তৈরি করুন।",
        href: "/ai-tools/cover-letter-generator",
        icon: "FileSignature",
        category: "Content & Writing",
        enabled: true,
    },
    {
        id: "ad-copy-generator",
        title: "বিজ্ঞাপনের কপি জেনারেটর",
        description: "আপনার পণ্যের জন্য আকর্ষণীয় বিজ্ঞাপনের কপি তৈরি করুন।",
        href: "/ai-tools/ad-copy-generator",
        icon: "Megaphone",
        category: "Content & Writing",
        enabled: false,
    },
    {
        id: "script-writer",
        title: "স্ক্রিপ্ট লেখক",
        description: "ইউটিউব বা টিকটক ভিডিওর জন্য আকর্ষণীয় স্ক্রিপ্ট তৈরি করুন।",
        href: "/ai-tools/script-writer",
        icon: "Youtube",
        category: "Content & Writing",
        enabled: false,
    },
    {
        id: "story-plot-generator",
        title: "গল্পের প্লট জেনারেটর",
        description: "আপনার পরবর্তী গল্প বা উপন্যাসের জন্য প্লট আইডিয়া তৈরি করুন।",
        href: "/ai-tools/story-plot-generator",
        icon: "GitBranchPlus",
        category: "Content & Writing",
        enabled: false,
    },
    {
        id: "poetry-lyrics-maker",
        title: "কবিতা ও গান লেখক",
        description: "আপনার অনুভূতি প্রকাশ করার জন্য কবিতা বা গান লিখুন।",
        href: "/ai-tools/poetry-lyrics-maker",
        icon: "Mic",
        category: "Content & Writing",
        enabled: false,
    },
    {
        id: "content-outline-generator",
        title: "কনটেন্ট আউটলাইন জেনারেটর",
        description: "যেকোনো বিষয়ের উপর ভিত্তি করে একটি সুগঠিত আউটলাইন তৈরি করুন।",
        href: "/ai-tools/content-outline-generator",
        icon: "List",
        category: "Content & Writing",
        enabled: false,
    },
    {
        id: "headline-generator",
        title: "শিরোনাম জেনারেটর",
        description: "আপনার ব্লগ বা ভিডিওর জন্য আকর্ষণীয় শিরোনাম তৈরি করুন।",
        href: "/ai-tools/headline-generator",
        icon: "PanelTopOpen",
        category: "Content & Writing",
        enabled: false,
    },
    {
        id: "content-calendar-planner",
        title: "কনটেন্ট ক্যালেন্ডার প্ল্যানার",
        description: "আপনার সোশ্যাল মিডিয়া বা ব্লগের জন্য একটি কনটেন্ট ক্যালেন্ডার তৈরি করুন।",
        href: "/ai-tools/content-calendar-planner",
        icon: "CalendarDays",
        category: "Productivity & Business",
        enabled: false,
    },
    {
        id: "image-generator",
        title: "এআই ইমেজ জেনারেটর",
        description: "পাঠ্য থেকে লোগো, ব্যানার এবং অন্যান্য ছবি তৈরি করুন।",
        href: "/ai-tools/image-generator",
        icon: "ImageIcon",
        category: "Image Generation",
        enabled: true,
    },
    {
        id: "passport-photo-maker",
        title: "পাসপোর্ট সাইজ ছবি মেকার",
        description: "যেকোনো ছবিকে একটি পেশাদার পাসপোর্ট ছবিতে রূপান্তর করুন।",
        href: "/ai-tools/passport-photo-maker",
        icon: "UserCircleIcon",
        category: "Image Generation",
        enabled: true,
    },
     {
        id: "handwriting-extractor",
        title: "হাতের লেখা এক্সট্র্যাক্টর",
        description: "হাতে লেখা নোট থেকে টেক্সট এক্সট্র্যাক্ট করে Word, Excel বা PDF এ রূপান্তর করুন।",
        href: "/ai-tools/handwriting-extractor",
        icon: "Edit",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "video-generator",
        title: "এআই ভিডিও জেনারেটর",
        description: "পাঠ্য প্রম্পট থেকে ছোট ভিডিও তৈরি করুন।",
        href: "/ai-tools/video-generator",
        icon: "Film",
        category: "Video & Animation",
        enabled: true,
    },
    {
        id: "image-to-video-generator",
        title: "ইমেজ টু ভিডিও জেনারেটর",
        description: "একটি ছবি আপলোড করে এবং প্রম্পট দিয়ে ভিডিও তৈরি করুন।",
        href: "/ai-tools/image-to-video-generator",
        icon: "Clapperboard",
        category: "Video & Animation",
        enabled: true,
    },
    {
        id: "prompt-generator",
        title: "প্রম্পট জেনারেটর",
        description: "ছবি, ভিডিও বা অডিওর জন্য বিস্তারিত এবং কার্যকর প্রম্পট তৈরি করুন।",
        href: "/ai-tools/prompt-generator",
        icon: "Sparkles",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "professional-email-writer",
        title: "পেশাদার ইমেল লেখক",
        description: "ক্লায়েন্ট এবং সহকর্মীদের জন্য পেশাদার ইমেল ড্রাফ্ট করুন।",
        href: "/ai-tools/professional-email-writer",
        icon: "Mail",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "note-summarizer",
        title: "নোট সারাংশকারী",
        description: "দীর্ঘ পাঠ্যকে সংক্ষিপ্ত নোটে পরিণত করুন।",
        href: "/ai-tools/note-summarizer",
        icon: "BookCheck",
        category: "Productivity & Business",
        enabled: true,
    },
     {
        id: "bengali-translator",
        title: "বাংলা কনটেন্ট অনুবাদক",
        description: "ইংরেজি এবং বাংলার মধ্যে পাঠ্য অনুবাদ করুন।",
        href: "/ai-tools/bengali-translator",
        icon: "Languages",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "refund-policy-generator",
        title: "রিফান্ড পলিসি জেনারেটর",
        description: "আপনার ব্যবসার জন্য একটি কাস্টম রিফান্ড পলিসি তৈরি করুন।",
        href: "/ai-tools/refund-policy-generator",
        icon: "Receipt",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "resume-helper",
        title: "জীবনবৃত্তান্ত/সিভি সহায়ক",
        description: "একটি পেশাদার এবং কার্যকর জীবনবৃত্তান্ত লিখতে সহায়তা পান।",
        href: "/ai-tools/resume-helper",
        icon: "FileText",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "business-name-generator",
        title: "ব্যবসার নাম জেনারেটর",
        description: "আপনার নতুন ব্যবসা বা ব্র্যান্ডের জন্য সেরা নামটি খুঁজুন।",
        href: "/ai-tools/business-name-generator",
        icon: "Lightbulb",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "website-blueprint-generator",
        title: "ওয়েবসাইট ব্লুপ্রিন্ট জেনারেটর",
        description: "আপনার ধারণার জন্য একটি পৃষ্ঠা এবং বৈশিষ্ট্যসহ একটি কাঠামো তৈরি করুন।",
        href: "/ai-tools/website-blueprint-generator",
        icon: "LayoutTemplate",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "seo-keyword-suggester",
        title: "এসইও কীওয়ার্ড সাজেশনকারী",
        description: "আপনার অনলাইন দৃশ্যমানতা উন্নত করতে কীওয়ার্ড আবিষ্কার করুন।",
        href: "/ai-tools/seo-keyword-suggester",
        icon: "BarChart",
        category: "SEO & Marketing",
        enabled: true,
    },
    {
        id: "seo-score-checker",
        title: "এসইও স্কোর চেকার",
        description: "আপনার কনটেন্টের এসইও স্কোর এবং উন্নতির জন্য পরামর্শ পান।",
        href: "/ai-tools/seo-score-checker",
        icon: "BarChart2",
        category: "SEO & Marketing",
        enabled: true,
    },
    {
        id: "interview-question-practice",
        title: "ইন্টারভিউ প্রশ্ন অনুশীলন",
        description: "আপনার পরবর্তী চাকরির ইন্টারভিউর জন্য অনুশীলন প্রশ্ন তৈরি করুন।",
        href: "/ai-tools/interview-question-practice",
        icon: "Briefcase",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "freelance-idea-generator",
        title: "ফ্রিল্যান্স আইডিয়া জেনারেটর",
        description: "আপনার দক্ষতার উপর ভিত্তি করে প্রকল্পের ধারণা পান।",
        href: "/ai-tools/freelance-idea-generator",
        icon: "Wand",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "price-rate-calculator",
        title: "মূল্য/রেট ক্যালকুলেটর",
        description: "আপনার ফ্রিল্যান্স পরিষেবার জন্য একটি ন্যায্য মূল্য গণনা করুন।",
        href: "/ai-tools/price-rate-calculator",
        icon: "DollarSign",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "domain-name-suggester",
        title: "ডোমেইন নেম সাজেশনকারী",
        description: "আপনার ব্যবসা বা ওয়েবসাইটের জন্য সেরা ডোমেইন নামটি খুঁজুন।",
        href: "/ai-tools/domain-name-suggester",
        icon: "Globe",
        category: "SEO & Marketing",
        enabled: true,
    },
    {
        id: "course-recommender",
        title: "কোর্স রিকমেন্ডার",
        description: "আপনার আগ্রহের উপর ভিত্তি করে ব্যক্তিগতকৃত কোর্স সাজেশন পান।",
        href: "/ai-tools/course-recommender",
        icon: "GraduationCap",
        category: "Productivity & Business",
        enabled: true,
    },
    {
        id: "quiz-generator",
        title: "কুইজ জেনারেটর",
        description: "আপনার জ্ঞান পরীক্ষা করার জন্য যেকোনো পাঠ্য থেকে একটি কুইজ তৈরি করুন।",
        href: "/ai-tools/quiz-generator",
        icon: "HelpCircle",
        category: "Productivity & Business",
        enabled: true,
    },
];
    

    


