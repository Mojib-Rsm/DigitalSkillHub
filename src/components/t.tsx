
"use client";

import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState, useMemo } from "react";

// Helper to detect if the string is likely Bengali
const isBengali = (text: string) => {
    // This regex checks for a few common Bengali characters.
    // A more robust solution might be needed for complex cases.
    return /[\u0980-\u09FF]/.test(text);
}

export default function T({ children }: { children: string }) {
  const { language, translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  const sourceLang = useMemo(() => isBengali(children) ? 'bn' : 'en', [children]);

  useEffect(() => {
    let isMounted = true;
    
    // If the component's text matches the target language, don't translate
    if ((language === 'bn' && sourceLang === 'bn') || (language === 'en' && sourceLang === 'en')) {
        if(isMounted) setTranslatedText(children);
        return;
    }

    // Otherwise, perform translation
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
