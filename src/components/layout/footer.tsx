
import Link from "next/link";
import Chatbot from "@/components/chatbot";
import { Bot, Twitter, Github, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

const footerLinks = {
    products: [
        { label: "AI Content Generator", href: "#" },
        { label: "Bulk Generation", href: "#" },
        { label: "WordPress Integration", href: "#" },
        { label: "Facebook Captions", href: "#" },
    ],
    support: [
        { label: "Contact Support", href: "#" },
        { label: "Community", href: "/community" },
        { label: "Free Tools", href: "/free-tools" },
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Press Kit", href: "#" },
    ],
    legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Refund Policy", href: "#" },
        { label: "Cookie Policy", href: "#" },
    ]
}

export default function Footer() {
  return (
    <>
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-2 pr-8">
                <Link href="/" className="flex items-center gap-2 mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold font-headline">TotaPakhi AI</span>
                </Link>
                <p className="text-muted-foreground">Revolutionizing Bengali content creation with advanced AI technology. Generate high-quality, culturally relevant content that resonates with your audience.</p>
                <div className="mt-6 flex gap-4">
                    <Button>Start Free Trial</Button>
                    <Button variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2"/>
                        WhatsApp Support
                    </Button>
                </div>
            </div>
            
            <div>
                <h4 className="font-semibold mb-4">Products</h4>
                <ul className="space-y-2">
                    {footerLinks.products.map(link => (
                        <li key={link.label}>
                            <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                    {footerLinks.support.map(link => (
                        <li key={link.label}>
                            <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link>
                        </li>
                    ))}
                </ul>
                 <h4 className="font-semibold mb-4 mt-6">Company</h4>
                <ul className="space-y-2">
                    {footerLinks.company.map(link => (
                        <li key={link.label}>
                            <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
             <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                    {footerLinks.legal.map(link => (
                        <li key={link.label}>
                            <Link href={link.href} className="text-muted-foreground hover:text-primary text-sm transition-colors">{link.label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
             <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} TotaPakhi AI. All rights reserved. Made with ❤️ in Bangladesh.
             </p>
             <div className="flex items-center gap-4">
                <p className="text-sm text-green-600 font-semibold">All systems operational</p>
                <div className="flex items-center gap-4">
                    <Link href="#" aria-label="Twitter">
                    <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                    <Link href="#" aria-label="GitHub">
                    <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                    <Link href="#" aria-label="LinkedIn">
                    <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </Link>
                </div>
             </div>
        </div>

      </div>
    </footer>
    <Chatbot />
    </>
  );
}

