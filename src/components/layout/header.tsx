

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Menu, ChevronDown, User, LogOut, LayoutDashboard, Coins, Settings, Star, Zap, X, Moon, Lightbulb } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getCurrentUser } from "@/services/user-service";
import { ThemeToggleButton } from "../theme-toggle-button";
import { logoutAction } from "@/app/logout/actions";
import { Separator } from "../ui/separator";
import { getActiveCoupons } from "@/services/coupon-service";
import LanguageToggleButton from "../language-toggle";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#whats-new", label: "What's New" },
  { href: "/#pricing", label: "Pricing" },
];

const moreLinks = [
    { href: "/about", label: "About Us" },
    { href: "/ai-tools", label: "All Tools" },
    { href: "/request-a-tool", label: "Request a Tool" },
]

const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
    >
      {label}
    </Link>
  );
  
const MobileNavLink = ({ href, label }: { href: string; label: string;}) => (
    <Link href={href} className="block px-4 py-3 text-base font-medium text-foreground/80 hover:bg-muted rounded-lg">
    <SheetClose asChild>
        <span>{label}</span>
    </SheetClose>
    </Link>
)


export default async function Header() {
  const user = await getCurrentUser();
  const activeCoupons = await getActiveCoupons();
  const primaryCoupon = activeCoupons.length > 0 ? activeCoupons[0] : null;

  const renderAuthSection = () => {
    if (user) {
      return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/pricing">
                    <Coins className="mr-2 size-4"/>
                    Credits: {user.credits ?? 0}
                </Link>
            </Button>
            <ThemeToggleButton/>
            <LanguageToggleButton />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profile_image} alt={user.name}/>
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4"/>
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                         <Link href="/dashboard/settings">
                            <Settings className="mr-2 h-4 w-4"/>
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                     <form action={logoutAction} className="w-full">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <button type="submit" className="w-full text-left flex items-center cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4"/>
                                <span>Logout</span>
                           </button>
                        </DropdownMenuItem>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      );
    }
    return (
        <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <LanguageToggleButton />
             <Button asChild>
                <Link href="/login">Sign In</Link>
             </Button>
             <Button variant="outline" asChild>
                <Link href="/signup">Sign Up</Link>
             </Button>
        </div>
    );
  };
  
  const MobileAuthSection = () => {
    if (user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                     <Avatar className="h-9 w-9">
                        <AvatarImage src={user.profile_image} alt={user.name}/>
                        <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard className="mr-2 h-4 w-4"/>
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                         <Link href="/dashboard/settings">
                            <Settings className="mr-2 h-4 w-4"/>
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator/>
                     <form action={logoutAction} className="w-full">
                        <DropdownMenuItem asChild>
                            <button type="submit" className="w-full text-left flex items-center cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4"/>
                                <span>Logout</span>
                           </button>
                        </DropdownMenuItem>
                    </form>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }
    return null;
  }

  return (
    <>
    {primaryCoupon && (
        <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold">
           🚀 {primaryCoupon.description || `LIMITED TIME! Get ${primaryCoupon.discountPercentage}% OFF with code`} <strong className="underline">{primaryCoupon.code}</strong>
           <Link href="/dashboard/pricing" className="ml-4 underline">View Plans</Link>
       </div>
    )}
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold font-headline">TotthoAi</span>
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
                            </Link>
                         </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
        <div className="hidden lg:flex items-center gap-2">
             {renderAuthSection()}
        </div>
        <div className="lg:hidden flex items-center gap-2">
            <MobileAuthSection/>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    <div className="flex items-center justify-between bg-background p-2 rounded-lg">
                        <Link href="/" className="flex items-center gap-2">
                            <Bot className="h-7 w-7 text-primary" />
                            <span className="text-xl font-bold font-headline">TotthoAi</span>
                        </Link>
                            <div className="flex items-center gap-2">
                            <ThemeToggleButton/>
                            <LanguageToggleButton />
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon"><X className="w-5 h-5"/></Button>
                            </SheetClose>
                            </div>
                        </div>
                  </SheetHeader>
                 <div className="flex flex-col h-full">
                    <div className="flex-grow p-4 space-y-2">
                        {[...navLinks, ...moreLinks].map(link => (
                            <MobileNavLink key={link.href} href={link.href} label={link.label} />
                        ))}
                    </div>
                    <div className="p-4 border-t flex flex-col gap-2">
                        <SheetClose asChild>
                            <Button asChild size="lg" className="w-full" variant="outline">
                                <Link href="/ai-tools">All Tools</Link>
                            </Button>
                        </SheetClose>
                        {user ? (
                            <SheetClose asChild>
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            </SheetClose>
                        ) : (
                             <SheetClose asChild>
                                <Button asChild size="lg" className="w-full">
                                    <Link href="/login">Login</Link>
                                </Button>
                            </SheetClose>
                        )}
                    </div>
                 </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
