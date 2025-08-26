
"use client";

import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
    File,
    Edit,
    MessageCircle,
    Link,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    List,
    ListOrdered,
    Image as ImageIcon,
    RefreshCw,
    Check,
    ChevronDown,
    ChevronRight,
    Info
} from 'lucide-react';
import { OneClickWriterOutput } from '@/ai/flows/one-click-writer';

const ScoreGauge = ({ score }: { score: number }) => {
    const getRotation = (s: number) => (s / 100) * 180;
    const rotation = getRotation(score);

    let color = "bg-red-500";
    if (score > 50) color = "bg-yellow-500";
    if (score > 75) color = "bg-green-500";

    return (
        <div className="w-48 h-24 overflow-hidden mx-auto relative mt-4">
            <div className="w-full h-full rounded-t-full border-t-[12px] border-l-[12px] border-r-[12px] border-gray-200 dark:border-gray-700"></div>
            <div className="absolute top-0 left-0 w-full h-full">
                <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1/2 origin-bottom transition-transform duration-500"
                    style={{ transform: `rotate(${rotation - 90}deg)` }}
                >
                    <div className="w-2 h-2 bg-primary rounded-full absolute -top-1 -left-0.5"></div>
                </div>
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-sm text-muted-foreground">/100</span>
            </div>
        </div>
    );
};

export default function ArticleEditor({ article }: { article: OneClickWriterOutput }) {

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-1 md:p-6 min-h-[calc(100vh-120px)] bg-muted/30">
            {/* Editor Column */}
            <div className="lg:col-span-2 xl:col-span-3 bg-background p-6 rounded-lg shadow-sm border space-y-4">
                <div className="flex items-center gap-2 flex-wrap p-2 border-b">
                    <Button variant="ghost" size="sm" className="font-semibold">
                       <MessageCircle className="w-4 h-4 mr-2" /> Write Ahead
                    </Button>
                    <Separator orientation="vertical" className="h-6" />
                     <Select defaultValue="paragraph">
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paragraph">Paragraph</SelectItem>
                            <SelectItem value="h1">Heading 1</SelectItem>
                            <SelectItem value="h2">Heading 2</SelectItem>
                            <SelectItem value="h3">Heading 3</SelectItem>
                        </SelectContent>
                    </Select>
                     <Separator orientation="vertical" className="h-6" />
                     <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Bold /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Italic /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Underline /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Strikethrough /></Button>
                     </div>
                     <Separator orientation="vertical" className="h-6" />
                     <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><List /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ListOrdered /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Link /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ImageIcon /></Button>
                     </div>
                     <Button variant="outline" size="sm" className="ml-auto">Detect and Humanize</Button>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <Label className="text-right text-muted-foreground">Meta Title</Label>
                        <Input defaultValue={article.seoTitle} className="border-none focus-visible:ring-0" />
                    </div>
                    <div className="grid grid-cols-[120px_1fr] items-start gap-4">
                        <Label className="text-right text-muted-foreground pt-2">Meta Description</Label>
                        <Textarea defaultValue={article.seoDescription} className="border-none focus-visible:ring-0" rows={2}/>
                    </div>
                     <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <Label className="text-right text-muted-foreground">URL Slug</Label>
                        <Input defaultValue={article.targetKeyword.replace(/\s+/g, '-')} className="border-none focus-visible:ring-0"/>
                    </div>
                     <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                        <Label className="text-right text-muted-foreground">Schema</Label>
                        <div className="flex gap-2">
                           <Badge variant="secondary">BlogPosting</Badge>
                           <Badge variant="secondary">SpeakableSpecification</Badge>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="prose dark:prose-invert max-w-none">
                     <h1>{article.seoTitle}</h1>
                     <div dangerouslySetInnerHTML={{ __html: article.article.replace(/<h2>/g, '<h3>').replace(/<\/h2>/g, '</h3>') }} />
                </div>
            </div>

            {/* SEO Sidebar */}
            <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                 <div className="flex justify-end">
                    <Button variant="link">
                        <ChevronRight className="w-4 h-4 mr-2"/>
                        Cruise Mode
                    </Button>
                </div>
                <Tabs defaultValue="optimize" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 text-xs h-auto">
                        <TabsTrigger value="optimize">Optimize</TabsTrigger>
                        <TabsTrigger value="brief">Brief</TabsTrigger>
                        <TabsTrigger value="gaps">Gaps/Gains</TabsTrigger>
                        <TabsTrigger value="research">Research</TabsTrigger>
                        <TabsTrigger value="interlinking">Inter-linking</TabsTrigger>
                    </TabsList>
                    <TabsContent value="optimize">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between items-center">
                                    <span>Content Score</span>
                                    <Button variant="ghost" size="sm" className="text-xs"><RefreshCw className="w-3 h-3 mr-1"/> Refresh Score</Button>
                                </CardTitle>
                            </CardHeader>
                             <CardContent>
                                <ScoreGauge score={article.readability.score} />
                                 <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                    <span>Avg. Score: 42</span>
                                    <span>Top Score: 52</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="mt-4">
                            <CardHeader>
                                <CardTitle className="text-base">Section Score</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="prompt">
                                        <AccordionTrigger className="text-sm">
                                            <div className="flex items-center gap-2">
                                               <span>Prompt Coverage</span>
                                               <Info className="w-3 h-3"/>
                                               <Badge variant="destructive" className="ml-2">1 issue found</Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <Button variant="outline" size="sm">Fix It</Button>
                                        </AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="schema">
                                        <AccordionTrigger className="text-sm">
                                             <div className="flex items-center gap-2">
                                               <span>Schema Markup</span>
                                               <Info className="w-3 h-3"/>
                                               <Badge variant="default" className="ml-2 bg-green-600">All good</Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>No issues found.</AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="key-terms">
                                        <AccordionTrigger className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <span>Key Terms</span>
                                                <Info className="w-3 h-3"/>
                                                <Badge variant="default" className="ml-2 bg-green-600">All good</Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>All key terms are included.</AccordionContent>
                                    </AccordionItem>
                                     <AccordionItem value="meta-tags">
                                        <AccordionTrigger className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <span>Meta Tags</span>
                                                <Info className="w-3 h-3"/>
                                                 <Badge variant="default" className="ml-2 bg-green-600">All good</Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>Meta tags are optimized.</AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
