
"use client";

import { useState } from 'react';
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter } from "lucide-react";

const allCourses = [
  {
    title: "Modern Web Development",
    category: "Web Development",
    instructor: "Jane Doe",
    price: 49.99,
    level: "Beginner",
    duration: "10 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "web development",
  },
  {
    title: "Advanced Graphic Design",
    category: "Graphics Design",
    instructor: "John Smith",
    price: 79.99,
    level: "Advanced",
    duration: "15 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "graphic design",
  },
  {
    title: "SEO & Digital Marketing Masterclass",
    category: "Digital Marketing",
    instructor: "Emily White",
    price: 99.99,
    level: "Intermediate",
    duration: "20 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "digital marketing",
  },
  {
    title: "Freelancing on Upwork",
    category: "Freelancing",
    instructor: "Michael Brown",
    price: 29.99,
    level: "Beginner",
    duration: "5 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "freelancing business",
  },
  {
    title: "Introduction to AI Tools",
    category: "AI Tools",
    instructor: "Sarah Green",
    price: 69.99,
    level: "Beginner",
    duration: "8 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "artificial intelligence",
  },
  {
    title: "UI/UX Design Fundamentals",
    category: "Graphics Design",
    instructor: "David Clark",
    price: 55.00,
    level: "Intermediate",
    duration: "12 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "user interface design",
  },
  {
    title: "React Deep Dive",
    category: "Web Development",
    instructor: "Jane Doe",
    price: 119.99,
    level: "Advanced",
    duration: "25 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "react code",
  },
  {
    title: "Social Media Marketing Strategy",
    category: "Digital Marketing",
    instructor: "Emily White",
    price: 45.99,
    level: "Beginner",
    duration: "7 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "social media icons",
  },
];

const categories = ["All", ...new Set(allCourses.map(c => c.category))];
const levels = ["All", ...new Set(allCourses.map(c => c.level))];
const priceRanges = ["All", "Under $50", "$50 - $100", "Over $100"];

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [level, setLevel] = useState('All');
    const [price, setPrice] = useState('All');

    const filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'All' || course.category === category;
        const matchesLevel = level === 'All' || course.level === level;
        const matchesPrice = price === 'All' || 
            (price === 'Under $50' && course.price < 50) ||
            (price === '$50 - $100' && course.price >= 50 && course.price <= 100) ||
            (price === 'Over $100' && course.price > 100);

        return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Course Marketplace</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find your next learning adventure. Explore our comprehensive catalog of courses.
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 mb-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative col-span-1 md:col-span-2 lg:col-span-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for courses or instructors..." 
                className="pl-10 h-12 text-base w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                    {levels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                    {priceRanges.map(range => <SelectItem key={range} value={range}>{range}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
            <CourseCard key={course.title} course={course} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <ListFilter className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4"/>
            <h3 className="text-2xl font-bold">No Courses Found</h3>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
}
