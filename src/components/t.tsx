
"use client";

import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState, useMemo } from "react";

// Helper to detect if the string is likely Bengali
const isBengali = (text: string) => {
    // This regex checks for a few common Bengali characters.
    return /[\u0980-\u09FF]/.test(text);
}

export default function T({ children }: { children: string }) {
  const { language, translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  const sourceLang = useMemo(() => isBengali(children) ? 'bn' : 'en', [children]);

  useEffect(() => {
    let isMounted = true;
    
    // If the app language is Bengali ('bn'), and the source text is also Bengali,
    // we don't need to do any translation. We can just render the original children.
    if (language === 'bn' && sourceLang === 'bn') {
        if(isMounted) {
            setTranslatedText(children);
        }
        return;
    }
    
    // If the app language is English ('en'), and the source text is also English,
    // we also don't need to do any translation.
    if (language === 'en' && sourceLang === 'en') {
        if(isMounted) {
            setTranslatedText(children);
        }
        return;
    }

    // Otherwise, we perform the translation.
    translate(children, sourceLang).then(result => {
        if (isMounted) {
            setTranslatedText(result);
        }
    });
    
    return () => { isMounted = false };

  }, [language, children, translate, sourceLang]);

  // Render the translated text. It will show original text until translation is complete.
  return <>{translatedText}</>;
}
