import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Brush, LineChart, Code, Bot, Sprout, Star } from "lucide-react";
import CourseCard from "@/components/course-card";

const featuredCourses = [
  {
    title: "Modern Web Development",
    category: "Web Development",
    instructor: "Jane Doe",
    price: "49.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "web development",
    icon: <Code className="w-8 h-8 text-primary" />,
  },
  {
    title: "Advanced Graphic Design",
    category: "Graphics Design",
    instructor: "John Smith",
    price: "59.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "graphic design",
    icon: <Brush className="w-8 h-8 text-primary" />,
  },
  {
    title: "SEO & Digital Marketing Masterclass",
    category: "Digital Marketing",
    instructor: "Emily White",
    price: "79.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "digital marketing",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Web Developer",
    testimonial: "Skill Sprout transformed my career. The courses are top-notch and the community is incredibly supportive. I landed my dream job within 3 months!",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "person portrait",
  },
  {
    name: "Samantha Lee",
    role: "Freelance Designer",
    testimonial: "The graphic design courses are fantastic. I learned so much and was able to build a strong portfolio that attracts high-paying clients.",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "woman portrait",
  },
  {
    name: "Michael Chen",
    role: "Marketing Strategist",
    testimonial: "I highly recommend the Digital Marketing track. The content is up-to-date with the latest industry trends, which gave me a real edge.",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "man smiling",
  },
];


export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight text-gray-800">
              Cultivate Your <span className="text-primary">Digital Future.</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Join Skill Sprout to master in-demand skills, from web development to AI tools. Learn from industry experts and grow your career or freelancing business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="transition-transform transform hover:scale-105">
                <Link href="/courses">
                  Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="transition-transform transform hover:scale-105">
                <Link href="/community">Join Community</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="https://placehold.co/600x450.png"
              alt="Digital learning illustration"
              data-ai-hint="digital learning collage"
              width={600}
              height={450}
              className="rounded-xl shadow-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-headline text-4xl font-bold mb-4">Featured Courses</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Hand-picked courses to help you get started on your learning journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.title} course={course} />
            ))}
          </div>
          <Button asChild variant="link" size="lg" className="mt-12 text-lg">
            <Link href="/courses">
              View All Courses <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-4xl font-bold text-center mb-12">
            What Our Students Say
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Card className="h-full flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <p className="text-muted-foreground italic mb-6">"{testimonial.testimonial}"</p>
                      </CardContent>
                      <div className="bg-muted p-6 flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
