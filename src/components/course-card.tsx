import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Course = {
  title: string;
  category: string;
  instructor: string;
  price: string;
  image: string;
  dataAiHint: string;
};

type CourseCardProps = {
  course: Course;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <CardHeader className="p-0">
        <Image
          src={course.image}
          alt={course.title}
          width={600}
          height={400}
          className="object-cover w-full h-48"
          data-ai-hint={course.dataAiHint}
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm font-semibold text-primary mb-1">{course.category}</p>
        <CardTitle className="text-xl font-bold leading-tight h-14">
          <Link href="#" className="hover:underline">
            {course.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 mt-4 text-muted-foreground text-sm">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="person avatar" />
            <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{course.instructor}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center bg-muted">
        <p className="text-2xl font-bold text-primary">${course.price}</p>
        <Button asChild>
          <Link href="#">Enroll Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
