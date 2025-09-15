
"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useTransition } from "react";
import { bengaliTranslator } from "@/ai/flows/bengali-translator";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("bn");
  const [isTranslating, startTransition] = useTransition();

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
  
  const translate = async (text: string): Promise<string> => {
    if (language === 'bn') {
        return text; // Already in Bengali or is the default
    }
    
    // Simple cache to avoid re-translating
    const cacheKey = `tr_${language}_${text}`;
    const cached = sessionStorage.getItem(cacheKey);
    if(cached) return cached;
    
    let translatedText = text;
    try {
        const result = await bengaliTranslator({ textToTranslate: text, targetLanguage: 'Bengali' });
        translatedText = result.translatedText;
        sessionStorage.setItem(cacheKey, translatedText);
    } catch (error) {
        console.error("Translation failed:", error);
    }
    return translatedText;
  };


  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate, isTranslating }}>
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
