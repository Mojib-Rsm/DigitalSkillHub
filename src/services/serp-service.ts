
'use server';

import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

export type SerpResult = {
    title: string;
    link: string;
    snippet: string;
};

export async function getSerpResults(query: string): Promise<SerpResult[]> {
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
        console.error("Google API Key or CSE ID is not configured in .env file.");
        throw new Error("SERP API is not configured. Please contact the administrator.");
    }

    const url = `https://www.googleapis.com/customsearch/v1`;

    try {
        const response = await axios.get(url, {
            params: {
                key: GOOGLE_API_KEY,
                cx: GOOGLE_CSE_ID,
                q: query,
            },
        });

        if (response.data.items) {
            return response.data.items.map((item: any) => ({
                title: item.title,
                link: item.link,
                snippet: item.snippet,
            }));
        }

        return [];
    } catch (error: any) {
        console.error("Error fetching SERP results:", error.response?.data?.error || error.message);
        if (error.response?.data?.error?.message) {
             throw new Error(`Google Search API Error: ${error.response.data.error.message}`);
        }
        throw new Error("Failed to fetch SERP results from Google.");
    }
}
