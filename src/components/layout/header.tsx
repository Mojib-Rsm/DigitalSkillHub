
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Menu, ChevronDown, LogOut, UserCircle, LayoutDashboard } from "lucide-react";
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
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#whats-new", label: "What's New" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/free-tools", label: "Free Tools" },
];

const moreLinks = [
    { href: "/blog", label: "Blog", description: "Insights, tutorials, and news."},
    { href: "/community", label: "Community Jobs", description: "Find small gigs and start earning."},
    { href: "/ai-tools", label: "AI Tools", description: "Explore our suite of AI tools."},
]


export default function Header() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Mock auth state

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
  
  const MobileNavLink = ({ href, label }: { href: string; label: string;}) => (
     <Link href={href} className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg">
        <span>{label}</span>
     </Link>
  )

  const AuthButtons = () => (
     <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
        </Button>
        <Button className="shadow-md" asChild>
            <Link href="/free-trial">Start Free Trial</Link>
        </Button>
     </div>
  );

  const UserMenu = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="rounded-full w-9 h-9 p-0">
                <Avatar>
                    <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar"/>
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator/>
            <DropdownMenuItem asChild>
                <Link href="/dashboard"><LayoutDashboard className="mr-2"/> Dashboard</Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
                <Link href="/profile"><UserCircle className="mr-2"/> Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem>
                <LogOut className="mr-2"/>
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );


  return (
    <>
    <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold">
        🚀 LIMITED TIME! • Get 25% OFF with code <strong className="underline">LAUNCH25</strong>
        <Link href="#pricing" className="ml-4 underline">Start Free Trial</Link>
    </div>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline">TotaPakhi AI</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
           <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-sm font-medium text-muted-foreground">More <ChevronDown className="w-4 h-4 ml-1"/></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                    {moreLinks.map(link => (
                         <DropdownMenuItem key={link.href} asChild>
                             <Link href={link.href} className="flex flex-col items-start gap-1">
                                <p className="font-semibold">{link.label}</p>
                                <p className="text-xs text-muted-foreground">{link.description}</p>
                            </Link>
                         </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? <UserMenu/> : <AuthButtons/>}
        </div>
        <div className="lg:hidden flex items-center gap-2">
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
                    <Bot className="h-7 w-7 text-primary" />
                    <span className="text-xl font-bold font-headline">TotaPakhi AI</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {[...navLinks, ...moreLinks].map((link) => (
                    <MobileNavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-4">
                 {isAuthenticated ? <UserMenu/> : <AuthButtons/>}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
