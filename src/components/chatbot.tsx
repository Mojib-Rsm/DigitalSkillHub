
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Bot, User, Sparkles } from "lucide-react";
import { chatbotAction } from "@/app/actions/chatbot";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "model";
  content: string;
};

const initialBotMessage: Message = {
  role: "model",
  content: "স্বাগতম! আমি আপনার TotthoAi সহকারী। আমি কীভাবে আপনাকে সাহায্য করতে পারি?",
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewportRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Load messages from session storage when component mounts
    try {
      const storedMessages = sessionStorage.getItem("chatMessages");
      if (storedMessages && JSON.parse(storedMessages).length > 0) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error("Failed to parse messages from session storage", error);
      sessionStorage.removeItem("chatMessages"); // Clear corrupted data
    }
  }, []);

  // Save messages to session storage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem("chatMessages", JSON.stringify(messages));
    } catch (error) {
      console.error("Failed to save messages to session storage", error);
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatbotAction({
        history: newMessages.slice(1), // Exclude initial welcome message from history
        message: input,
      });
      
      const botMessage: Message = { role: "model", content: result.reply };
      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      const errorMessage: Message = { role: "model", content: "দুঃখিত, একটি ত্রুটি ঘটেছে।" };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollViewportRef.current) {
        scrollViewportRef.current.scrollTo({
            top: scrollViewportRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
        // Optional: clear history on close, or keep it for the session.
        // For now, we keep it.
    }
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        size="icon"
      >
        <MessageSquare className="h-8 w-8" />
        <span className="sr-only">চ্যাটবট খুলুন</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent className="flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Bot />
              সহকারী হেল্প ডেস্ক
            </SheetTitle>
          </SheetHeader>
          <ScrollArea className="flex-grow p-4" viewportRef={scrollViewportRef}>
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : '')}>
                  {msg.role === 'model' && (
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn(
                    "rounded-lg p-3 max-w-xs", 
                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                   {msg.role === 'user' && (
                    <Avatar className="h-8 w-8">
                         <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3">
                   <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                        <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted flex items-center gap-2">
                        <Sparkles className="w-4 h-4 animate-spin"/>
                        <p className="text-sm text-muted-foreground">ভাবছি...</p>
                    </div>
                </div>
               )}
            </div>
          </ScrollArea>
          <SheetFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="আপনার প্রশ্ন লিখুন..."
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
