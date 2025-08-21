

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Check, Target, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const teamMembers = [
    { name: "Mojibur Rahman", role: "Founder & CEO", image: "https://placehold.co/100x100.png", dataAiHint: "man portrait" },
    { name: "Jane Doe", role: "Lead Developer", image: "https://placehold.co/100x100.png", dataAiHint: "woman developer" },
    { name: "John Smith", role: "Marketing Head", image: "https://placehold.co/100x100.png", dataAiHint: "man professional" },
];

export default function AboutUsPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-muted/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                        <Bot className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
                        About TotthoAi
                    </h1>
                    <p className="text-lg text-muted-foreground mt-6 max-w-3xl mx-auto">
                        We are revolutionizing content creation in Bengali and beyond, empowering creators with cutting-edge AI technology.
                    </p>
                </div>
            </section>

            {/* Mission and Vision Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <Image src="https://placehold.co/600x400.png" data-ai-hint="team collaboration office" alt="Our team working" width={600} height={400} className="rounded-lg shadow-lg" />
                    </div>
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="w-8 h-8 text-primary" />
                                <h2 className="font-headline text-3xl font-bold">Our Mission</h2>
                            </div>
                            <p className="text-muted-foreground">
                                To break down language barriers and make high-quality content creation accessible to everyone, especially in the Bengali-speaking world. We aim to provide powerful, intuitive tools that save time, boost creativity, and drive growth for our users.
                            </p>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Users className="w-8 h-8 text-primary" />
                                <h2 className="font-headline text-3xl font-bold">Our Vision</h2>
                            </div>
                            <p className="text-muted-foreground">
                                We envision a world where technology empowers every voice. By harnessing the power of AI, we strive to be the leading platform for multilingual content generation, fostering a vibrant digital ecosystem for creators, marketers, and businesses globally.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Values Section */}
            <section className="py-16 md:py-24 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Our Core Values</h2>
                        <p className="text-lg text-muted-foreground mt-4">
                            The principles that guide our work and our commitment to our users.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center p-6">
                            <CardTitle>Innovation</CardTitle>
                            <p className="text-muted-foreground mt-2">Continuously pushing the boundaries of AI to deliver state-of-the-art solutions.</p>
                        </Card>
                         <Card className="text-center p-6">
                            <CardTitle>User-Centricity</CardTitle>
                            <p className="text-muted-foreground mt-2">Placing our users at the heart of everything we do, from design to support.</p>
                        </Card>
                         <Card className="text-center p-6">
                            <CardTitle>Integrity</CardTitle>
                            <p className="text-muted-foreground mt-2">Operating with transparency, honesty, and a strong sense of responsibility.</p>
                        </Card>
                    </div>
                </div>
            </section>


            {/* Team Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Meet the Team</h2>
                        <p className="text-lg text-muted-foreground mt-4">
                            The passionate individuals behind TotthoAi's success.
                        </p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {teamMembers.map(member => (
                            <Card key={member.name} className="text-center p-6 shadow-md hover:shadow-xl transition-shadow">
                                <Avatar className="w-24 h-24 mx-auto mb-4">
                                    <AvatarImage src={member.image} alt={member.name} data-ai-hint={member.dataAiHint} />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-bold text-xl">{member.name}</h3>
                                <p className="text-primary font-semibold">{member.role}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Join Us CTA */}
            <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                     <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Join Our Journey</h2>
                     <p className="text-lg text-primary-foreground/80 mt-4 max-w-2xl mx-auto">
                        We're always looking for talented individuals to join our mission. If you're passionate about AI and content, we'd love to hear from you.
                     </p>
                     <div className="mt-8">
                         <Button size="lg" variant="secondary" asChild>
                            <Link href="/careers">View Open Positions</Link>
                         </Button>
                     </div>
                </div>
            </section>
        </div>
    );
}
