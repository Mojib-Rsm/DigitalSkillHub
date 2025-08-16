
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sprout, Menu, BookOpen, Users, Bot, LayoutDashboard, PenSquare, AudioWaveform, Contrast, Text, Accessibility, PlayCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { textToSpeechAction } from "@/app/actions/tts";

const navLinks = [
  { href: "/courses", label: "Courses", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/blog", label: "Blog", icon: <PenSquare className="w-5 h-5" /> },
  { href: "/community", label: "Community", icon: <Users className="w-5 h-5" /> },
  { href: "/ai-tool", label: "AI Tool", icon: <Bot className="w-5 h-5" /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
];

export default function Header() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);


  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleAudioMode = async () => {
    const newIsAudioMode = !isAudioMode;
    setIsAudioMode(newIsAudioMode);

    if (newIsAudioMode) {
      const mainContent = document.querySelector('main')?.innerText;
      if (mainContent) {
        try {
          const result = await textToSpeechAction(mainContent);
          if (result && result.media) {
            setAudioSrc(result.media);
          }
        } catch (error) {
          console.error("Error generating audio:", error);
          setIsAudioMode(false);
        }
      }
    } else {
      setAudioSrc(null);
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
   useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [audioSrc]);

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const increaseTextSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    document.documentElement.style.fontSize = `${currentSize * 1.1}px`;
  };


  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );
  
  const MobileNavLink = ({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) => (
     <Link href={href} className="flex items-center gap-4 px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg">
        {icon}
        <span>{label}</span>
     </Link>
  )

  const AccessibilityMenu = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
            <Accessibility className="h-6 w-6" />
            <span className="sr-only">Accessibility Settings</span>
        </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
        <DropdownMenuLabel>Accessibility</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={increaseTextSize}>
            <Text className="mr-2 h-4 w-4" />
            <span>Increase Text Size</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={toggleDarkMode}>
            <Contrast className="mr-2 h-4 w-4" />
            <span>{isDarkMode ? 'Disable' : 'Enable'} High Contrast</span>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={toggleAudioMode}>
            <AudioWaveform className="mr-2 h-4 w-4" />
            <span>{isAudioMode ? 'Disable' : 'Enable'} Audio Mode</span>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline">Digital Skill Hub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-4">
          <AccessibilityMenu />
          <Button variant="ghost">Sign In</Button>
          <Button>Sign Up</Button>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <AccessibilityMenu />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 mb-8">
                    <Sprout className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold font-headline">Digital Skill Hub</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                    <MobileNavLink key={link.href} href={link.href} label={link.label} icon={link.icon} />
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4">
                 <Button variant="outline" size="lg">Sign In</Button>
                 <Button size="lg">Sign Up</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
       {isAudioMode && audioSrc && (
        <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-full p-2 shadow-lg flex items-center gap-2">
          <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} />
          <Button onClick={togglePlayback} size="icon" variant="ghost" className="rounded-full">
            <PlayCircle className={cn("h-8 w-8 text-primary", isPlaying ? "fill-primary" : "")} />
          </Button>
        </div>
      )}
    </header>
  );
}
