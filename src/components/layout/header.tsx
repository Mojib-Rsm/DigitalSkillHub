
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sprout, Menu, BookOpen, Users, Bot, LayoutDashboard, PenSquare, AudioWaveform, Contrast, Text, Accessibility, PlayCircle, Phone } from "lucide-react";
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
  DropdownMenuGroup,
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

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.828 14.04C34.524 10.372 29.626 8 24 8C12.955 8 4 16.955 4 28s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691L14.613 21.1c1.761-4.36 6.096-7.5 11.387-7.5c2.563 0 4.935.89 6.852 2.451L32.486 9.8C29.232 7.234 25.272 6 21 6C14.34 6 8.361 9.772 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-8.197-6.556C27.027 34.091 25.561 35 24 35c-4.781 0-8.84-2.733-10.74-6.556l-8.313 6.701C9.06 39.068 15.86 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l8.197 6.556C41.427 36.657 44 32.617 44 28c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"/>
    </svg>
);


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
  
  const AuthButtons = () => (
     <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Sign Up / Sign In</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Join Digital Skill Hub</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <GoogleIcon />
              <span>Sign in with Google</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FacebookIcon />
              <span>Sign in with Facebook</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Phone />
              <span>Sign in with Phone</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  )


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
          <AuthButtons />
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
                 <AuthButtons />
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

    