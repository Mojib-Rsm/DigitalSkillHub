
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Newspaper } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const logos = [
    { name: "Primary Logo (SVG)", href: "#" },
    { name: "Primary Logo (PNG)", href: "#" },
    { name: "Icon Only (SVG)", href: "#" },
    { name: "Icon Only (PNG)", href: "#" },
];

const brandColors = [
    { name: "Primary", hex: "#22A5C1", hsl: "hsl(195 70% 50%)" },
    { name: "Accent", hex: "#32826A", hsl: "hsl(165 50% 40%)" },
    { name: "Foreground", hex: "#0B1526", hsl: "hsl(222.2 84% 4.9%)" },
    { name: "Background", hex: "#F0F4F5", hsl: "hsl(195 20% 95%)" },
];

export default function PressKitPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-muted/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                        <Newspaper className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
                        Press Kit
                    </h1>
                    <p className="text-lg text-muted-foreground mt-6 max-w-3xl mx-auto">
                        Resources for journalists, bloggers, and partners. Here you'll find brand assets, company information, and contact details for media inquiries.
                    </p>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-muted-foreground">
                                <p>
                                    TotthoAi is a cutting-edge AI content generation platform dedicated to empowering creators, marketers, and businesses worldwide. With a special focus on Bengali and over 150 other languages, we aim to break down language barriers and make high-quality, SEO-optimized content accessible to everyone.
                                </p>
                                <p>
                                    Our platform leverages state-of-the-art AI technology to automate and accelerate the content creation process, offering tools for one-click article generation, bulk content creation, video-to-blog conversion, and much more. Founded by Mojibur Rahman, TotthoAi is headquartered in Cox's Bazar, Bangladesh, with a mission to foster a vibrant digital ecosystem.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Logo Downloads Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Logos</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {logos.map(logo => (
                                    <Button key={logo.name} variant="outline" className="justify-start" asChild>
                                        <Link href={logo.href}>
                                            <Download className="mr-2"/>
                                            {logo.name}
                                        </Link>
                                    </Button>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Brand Colors Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Brand Colors</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {brandColors.map(color => (
                                    <div key={color.name} className="text-center">
                                        <div className="w-full h-24 rounded-lg mb-2" style={{ backgroundColor: color.hex }}></div>
                                        <p className="font-semibold">{color.name}</p>
                                        <p className="text-sm text-muted-foreground">{color.hex}</p>
                                        <p className="text-xs text-muted-foreground">{color.hsl}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                         <Card>
                            <CardHeader>
                                <CardTitle>Key Facts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p><strong>Founded:</strong> 2023</p>
                                <p><strong>Founder & CEO:</strong> Mojibur Rahman</p>
                                <p><strong>Location:</strong> Cox's Bazar, Bangladesh</p>
                                <p><strong>Website:</strong> <Link href="https://totthoai.mojib.me/" className="text-primary hover:underline">totthoai.mojib.me</Link></p>
                                <p><strong>Languages Supported:</strong> 150+</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Media Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p className="font-semibold">Press Inquiries</p>
                                <p className="text-muted-foreground">For all media-related questions, please contact:</p>
                                <a href="mailto:press@totthoai.com" className="text-primary hover:underline">press@totthoai.com</a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
