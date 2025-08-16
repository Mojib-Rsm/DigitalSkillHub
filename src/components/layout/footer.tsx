
import Link from "next/link";
import Chatbot from "@/components/chatbot";
import { Sprout, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <>
    <footer className="bg-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-headline">ডিজিটাল স্কিল হাব</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ডিজিটাল স্কিল হাব। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
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
    </footer>
    <Chatbot />
    </>
  );
}
