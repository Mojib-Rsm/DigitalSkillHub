"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sprout, Menu, BookOpen, Users, Bot, LayoutDashboard, PenSquare } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/courses", label: "Courses", icon: <BookOpen className="w-5 h-5" /> },
  { href: "/blog", label: "Blog", icon: <PenSquare className="w-5 h-5" /> },
  { href: "/community", label: "Community", icon: <Users className="w-5 h-5" /> },
  { href: "/ai-tool", label: "AI Tool", icon: <Bot className="w-5 h-5" /> },
  { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
];

export default function Header() {
  const pathname = usePathname();

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
          <Button variant="ghost">Sign In</Button>
          <Button>Sign Up</Button>
        </div>
        <div className="md:hidden">
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
    </header>
  );
}
