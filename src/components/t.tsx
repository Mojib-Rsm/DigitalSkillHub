
"use client";

import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState } from "react";

export default function T({ children }: { children: string }) {
  const { language, translate } = useLanguage();
  const [translatedText, setTranslatedText] = useState(children);

  useEffect(() => {
    if (language === 'en') {
        setTranslatedText(children);
    } else {
        // Since we are now defaulting to Bengali, we need to translate from English
        const originalEnglish = children; // Assuming children is always English
        translate(originalEnglish).then(setTranslatedText);
    }
  }, [language, children, translate]);

  return <>{translatedText}</>;
}
