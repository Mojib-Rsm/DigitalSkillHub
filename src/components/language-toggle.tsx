
"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "./ui/button";

export default function LanguageToggleButton() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {language === "en" ? "বাংলা" : "EN"}
    </Button>
  );
}
