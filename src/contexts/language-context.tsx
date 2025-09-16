
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { bengaliTranslator } from "@/ai/flows/bengali-translator";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string, sourceLang: 'en' | 'bn') => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language;
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "bn")) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguageState(lang);
  };
  
  const translate = useCallback(async (text: string, sourceLang: 'en' | 'bn'): Promise<string> => {
    const targetLanguage = language;
    
    // If the source is the same as the target, no need to translate
    if (sourceLang === targetLanguage) {
      return text;
    }
    
    // Simple cache to avoid re-translating
    const cacheKey = `tr_${sourceLang}_${targetLanguage}_${text}`;
    const cached = sessionStorage.getItem(cacheKey);
    if(cached) return cached;
    
    try {
      const result = await bengaliTranslator({ 
        textToTranslate: text, 
        targetLanguage: targetLanguage === 'bn' ? 'Bengali' : 'English'
      });
      const translatedText = result.translatedText;
      sessionStorage.setItem(cacheKey, translatedText);
      return translatedText;
    } catch (error) {
        console.warn(`Translation failed for "${text}". Using fallback. Error:`, error);
        // Fallback to original text if API fails.
        return text;
    }
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
