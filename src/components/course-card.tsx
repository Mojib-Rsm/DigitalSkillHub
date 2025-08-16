
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, BarChart, ShoppingCart } from "lucide-react";

type Course = {
  title: string;
  category: string;
  instructor: string;
  price: number;
  level: string;
  duration: string;
  image: string;
  dataAiHint: string;
};

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href="#" className="block">
            <Image
            src={course.image}
            alt={course.title}
            width={600}
            height={400}
            className="object-cover w-full h-48"
            data-ai-hint={course.dataAiHint}
            />
        </Link>
        <Badge className="absolute top-3 right-3">{course.category}</Badge>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1.5">
                <BarChart className="w-4 h-4" />
                <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{course.duration}</span>
            </div>
        </div>
        <CardTitle className="text-lg font-bold leading-tight h-12">
          <Link href="#" className="hover:text-primary transition-colors">
            {course.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 mt-3 text-muted-foreground text-sm">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" />
            <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{course.instructor}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted/50">
        <p className="text-2xl font-bold text-primary">{course.price > 0 ? `$${course.price.toFixed(2)}` : 'ফ্রি'}</p>
        <Button asChild>
          <Link href="#">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {course.price > 0 ? 'কার্টে যোগ করুন' : 'এখনই ভর্তি হন'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
