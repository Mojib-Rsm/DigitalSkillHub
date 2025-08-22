
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useActionState, useFormStatus } from "react-dom";
import { generateArticleAction } from "@/app/ai-tools/one-click-writer/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Clipboard, Download, FileText, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
// Remark and rehype plugins for markdown rendering
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSanitize from 'rehype-sanitize';
import rehypeFormat from 'rehype-format';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Generating Article...
        </>
      ) : (
        <>
          <Bot className="mr-2 h-5 w-5" />
          Generate Article
        </>
      )}
    </Button>
  );
}

// Function to convert markdown to HTML
async function markdownToHtml(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdown);
  return String(file);
}


export default function OneClickWriterForm() {
  const initialState = { message: "", issues: [], data: undefined, fields: {} };
  const [state, formAction] = useActionState(generateArticleAction, initialState);
  const [renderedHtml, setRenderedHtml] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        });
    }
    if (state.data?.article) {
        markdownToHtml(state.data.article).then(setRenderedHtml);
    }
  }, [state, toast]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied to Clipboard!",
    });
  };

  const handleDownload = () => {
    if (!state.data) return;
    const blob = new Blob([state.data.article], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${state.data.seoTitle.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Article Title</CardTitle>
        <CardDescription>
          Provide a clear and descriptive title for the article you want to generate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., How AI is Revolutionizing the Freelance Industry"
              defaultValue={state.fields?.title}
              required
              className="text-lg p-4"
            />
            {state.issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {useFormStatus().pending && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground font-semibold animate-pulse">Generating your article...</p>
                    <p className="text-muted-foreground text-sm">This may take a minute. Please don't navigate away.</p>
                </div>
            </div>
        )}

        {state.data && !useFormStatus().pending &&(
          <div className="mt-8 space-y-6">
            <h3 className="text-3xl font-bold font-headline text-center">Your Generated Article</h3>
            
            <Card>
                <CardHeader>
                    <CardTitle>SEO & Meta Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Alert>
                        <AlertTitle>SEO Title</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                           <p>{state.data.seoTitle}</p>
                           <Button variant="ghost" size="icon" onClick={() => handleCopy(state.data!.seoTitle)}><Clipboard className="w-4 h-4"/></Button>
                        </AlertDescription>
                    </Alert>
                     <Alert>
                        <AlertTitle>SEO Description</AlertTitle>
                        <AlertDescription className="flex justify-between items-center">
                           <p>{state.data.seoDescription}</p>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(state.data!.seoDescription)}><Clipboard className="w-4 h-4"/></Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                     <Image src={state.data.featuredImageUrl} alt={state.data.seoTitle} width={1024} height={576} className="rounded-lg border object-contain w-full"/>
                </CardContent>
                <CardFooter>
                    <a href={state.data.featuredImageUrl} download={`${state.data.seoTitle.replace(/\s+/g, '_')}_featured_image.png`}>
                        <Button variant="outline"><Download className="mr-2"/> Download Image</Button>
                    </a>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <CardTitle>Article Content</CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleCopy(state.data!.article)}><Clipboard className="mr-2"/> Copy Markdown</Button>
                        <Button variant="outline" onClick={handleDownload}><Download className="mr-2"/> Download .md</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
