
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const jobOpenings = [
    {
        title: "Senior Frontend Developer",
        location: "Remote (Bangladesh)",
        type: "Full-time",
        description: "We are looking for an experienced Frontend Developer to build and maintain our user-facing applications using Next.js, React, and TypeScript."
    },
    {
        title: "AI/ML Engineer",
        location: "Cox's Bazar, Bangladesh",
        type: "Full-time",
        description: "Join our AI team to develop and fine-tune large language models, focusing on Bengali language processing and content generation."
    },
    {
        title: "Digital Marketing Specialist",
        location: "Remote",
        type: "Contract",
        description: "Drive our growth by creating and executing marketing campaigns across various digital channels, including social media, SEO, and email."
    },
    {
        title: "Customer Support Executive",
        location: "Cox's Bazar, Bangladesh",
        type: "Full-time",
        description: "Be the voice of TotthoAi! Provide outstanding support to our users via email, chat, and WhatsApp, helping them succeed with our platform."
    }
];

const perks = [
    "Competitive Salary",
    "Flexible Work Hours",
    "Health Insurance",
    "Annual Retreats",
    "Learning & Development Budget",
    "Performance Bonuses"
];

export default function CareersPage() {
    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-muted/50">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                        <Briefcase className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto">
                        Careers at TotthoAi
                    </h1>
                    <p className="text-lg text-muted-foreground mt-6 max-w-3xl mx-auto">
                        Join our passionate team and help us build the future of AI-powered content creation.
                    </p>
                </div>
            </section>

            {/* Job Listings Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <h2 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-center">
                        Current Openings
                    </h2>
                    {jobOpenings.length > 0 ? (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {jobOpenings.map(job => (
                                <Card key={job.title} className="shadow-md hover:shadow-xl transition-shadow">
                                    <CardHeader>
                                        <CardTitle>{job.title}</CardTitle>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground pt-2">
                                            <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {job.location}</div>
                                            <div className="flex items-center gap-1.5"><Clock className="w-4 h-4"/> {job.type}</div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground text-sm">{job.description}</p>
                                        <Button variant="link" className="px-0 mt-4">
                                            Apply Now <ArrowRight className="w-4 h-4 ml-1" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center mt-12 max-w-xl mx-auto">
                             <p className="text-xl text-muted-foreground">
                                We don't have any open positions at the moment, but we're always looking for talented people.
                             </p>
                             <Button size="lg" className="mt-6">
                                <Link href="mailto:careers@totthoai.com">Send Your Resume</Link>
                             </Button>
                         </div>
                    )}
                </div>
            </section>

             {/* Why Join Us Section */}
            <section className="py-16 md:py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                     <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Why You'll Love Working Here</h2>
                     <p className="text-lg text-primary-foreground/80 mt-4 max-w-3xl mx-auto">
                        We believe in fostering a creative, collaborative, and rewarding environment for our team.
                     </p>
                     <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {perks.map(perk => (
                             <div key={perk} className="bg-primary-foreground/10 p-4 rounded-lg">
                                 <p className="font-semibold text-white">{perk}</p>
                             </div>
                        ))}
                     </div>
                </div>
            </section>
        </div>
    )
}
