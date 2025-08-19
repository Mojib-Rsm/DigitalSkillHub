
"use client";

import ContactForm from "@/components/contact-form";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
            <Mail className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have a question, feedback, or need support, our team is here to help.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ContactForm />
      </div>
    </div>
  );
}
