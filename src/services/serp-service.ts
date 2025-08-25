
'use server';

import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const DATAFORSEO_LOGIN = process.env.DATAFORSEO_LOGIN;
const DATAFORSEO_PASSWORD = process.env.DATAFORSEO_PASSWORD;


export type SerpResult = {
    title: string;
    link: string;
    snippet: string;
};

export type KeywordData = {
    search_volume: number | null;
    cpc: number | null;
};

export type RelatedQuestion = {
    question: string;
};


export async function getSerpResults(query: string): Promise<SerpResult[]> {
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
        console.error("Google API Key or CSE ID is not configured in .env file. Please check the setup guide.");
        // Don't throw, just return empty as it might be an optional service
        return [];
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
        if (error.response?.data?.error?.message) {
             console.error(`Google Search API Error: ${error.response.data.error.message}. Please check your API key and quota in the setup guide.`);
        } else {
            console.error("Error fetching SERP results from Google:", error.message);
        }
        // Don't throw, return empty array
        return [];
    }
}


class SerpApi {
    private apiKey: string;
    private baseUrl = 'https://serpapi.com/search.json';

    constructor() {
        if (!SERPAPI_KEY) {
            throw new Error('SerpApi key is not configured. Please add SERPAPI_KEY to your .env file. See setup_guide.md');
        }
        this.apiKey = SERPAPI_KEY;
    }

    async getRelatedQuestions(query: string): Promise<RelatedQuestion[]> {
        try {
            const response = await axios.get(this.baseUrl, {
                params: {
                    engine: 'google',
                    q: query,
                    api_key: this.apiKey,
                },
            });
            return response.data.related_questions?.map((item: any) => ({ question: item.question })) || [];
        } catch (error: any) {
            console.error('Error fetching from SerpApi:', error.message);
            return [];
        }
    }
}

class DataForSeo {
    private login;
    private password;
    private baseUrl = 'https://api.dataforseo.com/v3';

    constructor() {
        if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
            throw new Error('DataForSEO credentials are not configured. Please add them to your .env file. See setup_guide.md');
        }
        this.login = DATAFORSEO_LOGIN;
        this.password = DATAFORSEO_PASSWORD;
    }

    async getKeywordData(keyword: string, country: string): Promise<KeywordData> {
        const postData = [{
            "language_name": "English",
            "location_name": country,
            "keywords": [keyword]
        }];
        
        try {
            const response = await axios.post(`${this.baseUrl}/keywords_data/google_ads/search_volume/live`, postData, {
                auth: {
                    username: this.login,
                    password: this.password
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.tasks_error > 0) {
                 console.error('DataForSEO task error:', response.data.tasks[0].error_message);
                 return { search_volume: null, cpc: null };
            }

            const result = response.data.tasks[0]?.result[0];
            return {
                search_volume: result?.search_volume || 0,
                cpc: result?.cpc || 0
            };
        } catch (error: any) {
            console.error('Error fetching from DataForSEO:', error.response?.data || error.message);
            return { search_volume: null, cpc: null };
        }
    }
}

export async function getKeywordData(keyword: string, country: string): Promise<KeywordData> {
    if (!DATAFORSEO_LOGIN || !DATAFORSEO_PASSWORD) {
        console.warn('DataForSEO credentials not set, skipping keyword data fetch. See setup_guide.md for instructions.');
        return { search_volume: null, cpc: null };
    }
    const dataForSeo = new DataForSeo();
    return dataForSeo.getKeywordData(keyword, country);
}

export async function getRelatedQuestions(query: string): Promise<RelatedQuestion[]> {
     if (!SERPAPI_KEY) {
        console.warn('SerpApi key not set, skipping related questions fetch. See setup_guide.md for instructions.');
        return [];
    }
    const serpApi = new SerpApi();
    return serpApi.getRelatedQuestions(query);
}
