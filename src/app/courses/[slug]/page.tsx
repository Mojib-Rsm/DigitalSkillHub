

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, PlayCircle, BookOpen, Clock, BarChart, User } from 'lucide-react';
import { getCourseBySlug } from '@/services/course-service';
import { notFound } from 'next/navigation';

const courseData = {
  title: 'বাংলায় ফ্রিল্যান্সিং শুরু',
  instructor: {
    name: 'আবুল কালাম',
    bio: 'আবুল কালাম একজন অভিজ্ঞ ফ্রিল্যান্সার এবং প্রশিক্ষক যিনি গত ৫ বছর ধরে সফলভাবে আপওয়ার্ক এবং ফাইবারে কাজ করছেন। তিনি শত শত শিক্ষার্থীকে ফ্রিল্যান্সিং জগতে তাদের ক্যারিয়ার শুরু করতে সহায়তা করেছেন।',
    avatar: 'https://placehold.co/100x100.png',
    dataAiHint: 'instructor portrait',
  },
  introVideo: 'https://placehold.co/1280x720.png',
  dataAiHint: 'freelancing tutorial video',
  duration: '12 ঘন্টা',
  level: 'শিক্ষানবিশ',
  students: 1250,
  rating: 4.8,
  reviews: [
    {
      name: 'সাদিয়া ইসলাম',
      avatar: 'https://placehold.co/40x40.png',
      dataAiHint: 'woman portrait',
      rating: 5,
      comment: 'এই কোর্সটি আমার ফ্রিল্যান্সিং ক্যারিয়ারের জন্য একটি গেম-চেঞ্জার ছিল। প্রশিক্ষক সবকিছু খুব সহজভাবে ব্যাখ্যা করেছেন।',
    },
    {
      name: 'রাশেদ খান',
      avatar: 'https://placehold.co/40x40.png',
      dataAiHint: 'man smiling',
      rating: 4,
      comment: 'চমৎকার কোর্স! আমি আরও ব্যবহারিক উদাহরণ দেখতে চেয়েছিলাম, কিন্তু সামগ্রিকভাবে খুব সহায়ক ছিল।',
    },
  ],
  syllabus: [
    {
      module: 'Module 1: Introduction to Freelancing',
      lessons: ['What is Freelancing?', 'Pros and Cons', 'Setting up your Mindset'],
    },
    {
      module: 'Module 2: Finding Your Niche',
      lessons: ['Identifying Your Skills', 'Researching Profitable Niches', 'Choosing Your Services'],
    },
    {
      module: 'Module 3: Building Your Profile',
      lessons: ['Creating a Winning Profile', 'Writing a Compelling Bio', 'Portfolio Creation'],
    },
    {
      module: 'Module 4: Finding Clients',
      lessons: ['Upwork & Fiverr Basics', 'Writing Winning Proposals', 'Bidding Strategies'],
    },
  ],
  price: 49.99,
};

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    notFound();
  }

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": `Learn ${course.title} with our comprehensive online course. Perfect for ${course.level} learners.`,
    "provider": {
        "@type": "Organization",
        "name": "TotthoAi",
        "sameAs": "https://totthoai.mojib.me"
    },
    "offers": {
        "@type": "Offer",
        "category": "Paid",
        "price": course.price,
        "priceCurrency": "BDT" // Assuming BDT, change if needed
    }
  };

  return (
    <>
     <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
    />
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Title */}
          <h1 className="font-headline text-5xl font-bold">{course.title}</h1>

          {/* Course Meta */}
           <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
             <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>প্রশিক্ষক: <strong>{course.instructor}</strong></span>
             </div>
             <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5" />
                <span>লেভেল: <strong>{course.level}</strong></span>
             </div>
             <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>স্থিতিকাল: <strong>{course.duration}</strong></span>
             </div>
           </div>

          {/* Course Intro Video */}
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="p-0 relative">
              <Image src={courseData.introVideo} alt="Course Intro Video" width={1280} height={720} className="w-full object-cover" data-ai-hint={courseData.dataAiHint}/>
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="w-24 h-24 text-white/80 hover:text-white transition-colors cursor-pointer"/>
              </div>
            </CardHeader>
          </Card>
          
          {/* Syllabus */}
          <div>
            <h2 className="text-3xl font-bold font-headline mb-4">কোর্স সিলেবাস</h2>
            <Accordion type="single" collapsible className="w-full">
              {courseData.syllabus.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold">{item.module}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      {item.lessons.map((lesson, i) => <li key={i}>{lesson}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Instructor Bio */}
          <div>
            <h2 className="text-3xl font-bold font-headline mb-4">প্রশিক্ষক সম্পর্কে</h2>
            <Card className="bg-muted/50">
              <CardContent className="p-6 flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={courseData.instructor.avatar} data-ai-hint={courseData.instructor.dataAiHint} />
                  <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{course.instructor}</h3>
                  <p className="text-muted-foreground">{courseData.instructor.bio}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Reviews */}
          <div>
            <h2 className="text-3xl font-bold font-headline mb-4">শিক্ষার্থীদের মতামত</h2>
            <div className="space-y-6">
                {courseData.reviews.map((review, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                           <div className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src={review.avatar} data-ai-hint={review.dataAiHint}/>
                                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-semibold">{review.name}</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`}/>
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mt-2">{review.comment}</p>
                                </div>
                           </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
                <p className="text-4xl font-bold text-primary text-center">৳{course.price}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button size="lg" className="w-full text-lg">এখনই ভর্তি হন</Button>
              <p className="text-xs text-muted-foreground text-center">৩০ দিনের মানি-ব্যাক গ্যারান্টি</p>
              <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold">এই কোর্সে অন্তর্ভুক্ত:</h4>
                  <ul className="list-none space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary"/>{course.duration} অন-ডিমান্ড ভিডিও</li>
                    <li className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary"/>আজীবন অ্যাক্সেস</li>
                    <li className="flex items-center gap-2"><PlayCircle className="w-4 h-4 text-primary"/>মোবাইল এবং টিভিতে অ্যাক্সেস</li>
                  </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
