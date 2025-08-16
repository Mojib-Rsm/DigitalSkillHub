import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const allCourses = [
  {
    title: "Modern Web Development",
    category: "Web Development",
    instructor: "Jane Doe",
    price: "49.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "web development",
  },
  {
    title: "Advanced Graphic Design",
    category: "Graphics Design",
    instructor: "John Smith",
    price: "59.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "graphic design",
  },
  {
    title: "SEO & Digital Marketing Masterclass",
    category: "Digital Marketing",
    instructor: "Emily White",
    price: "79.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "digital marketing",
  },
  {
    title: "Freelancing on Upwork",
    category: "Freelancing",
    instructor: "Michael Brown",
    price: "29.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "freelancing business",
  },
  {
    title: "Introduction to AI Tools",
    category: "AI Tools",
    instructor: "Sarah Green",
    price: "69.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "artificial intelligence",
  },
  {
    title: "UI/UX Design Fundamentals",
    category: "Graphics Design",
    instructor: "David Clark",
    price: "55.00",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "user interface design",
  },
  {
    title: "React Deep Dive",
    category: "Web Development",
    instructor: "Jane Doe",
    price: "89.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "react code",
  },
  {
    title: "Social Media Marketing Strategy",
    category: "Digital Marketing",
    instructor: "Emily White",
    price: "45.99",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "social media icons",
  },
];

export default function CoursesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Course Marketplace</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find your next learning adventure. Explore our comprehensive catalog of courses.
        </p>
      </div>
      <div className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for courses..." className="pl-10 h-12 text-base" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allCourses.map((course) => (
          <CourseCard key={course.title} course={course} />
        ))}
      </div>
    </div>
  );
}
