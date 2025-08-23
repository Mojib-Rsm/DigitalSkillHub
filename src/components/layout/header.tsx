
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, Menu, ChevronDown, User, LogOut, LayoutDashboard, Coins, Settings } from "lucide-react";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getCurrentUser } from "@/services/user-service";
import { ThemeToggleButton } from "../theme-toggle-button";
import { logoutAction } from "@/app/logout/actions";

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

const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
    >
      {label}
    </Link>
  );
  
  const MobileNavLink = ({ href, label }: { href: string; label: string;}) => (
     <Link href={href} className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg">
        <span>{label}</span>
     </Link>
  )


export default async function Header() {
  const user = await getCurrentUser();

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
                        <DropdownMenuItem asChild>
                               <button type="submit" className="w-full cursor-pointer">
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
      <>
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/free-trial">Start Free Trial</Link>
        </Button>
      </>
    );
  };

  return (
    <>
    <div className="bg-primary text-primary-foreground text-center py-1.5 text-sm font-semibold">
        🚀 LIMITED TIME! • Get 25% OFF with code <strong className="underline">LAUNCH25</strong>
        <Link href="/dashboard/pricing" className="ml-4 underline">View Plans</Link>
    </div>
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
                                <p className="text-xs text-muted-foreground">{link.description}</p>
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
            <ThemeToggleButton />
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
                      <span className="text-xl font-bold font-headline">TotthoAi</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2">
                  {[...navLinks, ...moreLinks].map((link) => (
                      <MobileNavLink key={link.href} href={link.href} label={link.label} />
                  ))}
                </div>
                 <div className="mt-8 pt-4 border-t">
                    {user ? (
                        <>
                         <MobileNavLink href="/dashboard" label="Dashboard"/>
                         <form action={logoutAction} className="w-full">
                            <button type="submit" className="w-full text-left block px-4 py-3 text-lg font-medium hover:bg-muted rounded-lg">Logout</button>
                         </form>
                        </>
                    ) : (
                        <>
                        <MobileNavLink href="/login" label="Login"/>
                        <MobileNavLink href="/free-trial" label="Start Free Trial"/>
                        </>
                    )}
                 </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
