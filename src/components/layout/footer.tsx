
import Link from "next/link";
import Chatbot from "@/components/chatbot";
import { Bot, Twitter, Github, Linkedin, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

const footerLinks = {
    products: [
        { label: "AI Content Generator", href: "/ai-tools" },
        { label: "AI Image Generator", href: "/ai-tools/image-generator" },
        { label: "AI Video Generator", href: "/ai-tools/video-generator" },
        { label: "Facebook Captions", href: "/ai-tools/facebook-comment-generator" },
    ],
    support: [
        { label: "Contact Support", href: "/contact" },
    ],
    company: [
        { label: "About Us", href: "/about" },
    ],
    legal: [
        { label: "Privacy Policy", href: "/legal/privacy-policy" },
        { label: "Terms of Service", href: "/legal/terms-of-service" },
        { label: "Refund Policy", href: "/legal/refund-policy" },
        { label: "Cookie Policy", href: "/legal/cookie-policy" },
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
                    <span className="text-2xl font-bold font-headline">TotthoAi</span>
                </Link>
                <p className="text-muted-foreground">Revolutionizing Bengali content creation with advanced AI technology. Generate high-quality, culturally relevant content that resonates with your audience.</p>
                <div className="mt-6 flex gap-4">
                    <Button asChild><Link href="/#pricing">View Plans</Link></Button>
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
                © {new Date().getFullYear()} TotthoAi. All rights reserved. Made with ❤️ in Bangladesh.
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
