
"use client";

import { useState, useEffect } from 'react';
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter } from "lucide-react";
import { getCourses, Course } from '@/services/course-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function CoursesPage() {
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [level, setLevel] = useState('All');
    const [price, setPrice] = useState('All');

    useEffect(() => {
        async function fetchCourses() {
            setIsLoading(true);
            const courses = await getCourses();
            setAllCourses(courses);
            setIsLoading(false);
        }
        fetchCourses();
    }, []);

    const categories = ["All", ...new Set(allCourses.map(c => c.category))];
    const levels = ["All", ...new Set(allCourses.map(c => c.level))];
    const priceRanges = ["All", "Free", "Under $50", "$50 - $100"];

    const filteredCourses = allCourses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'All' || course.category === category;
        const matchesLevel = level === 'All' || course.level === level;
        const matchesPrice = price === 'All' ||
            (price === 'Free' && course.price === 0) ||
            (price === 'Under $50' && course.price > 0 && course.price < 50) ||
            (price === '$50 - $100' && course.price >= 50 && course.price <= 100);

        return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">আমাদের কোর্সসমূহ</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          আপনার প্রয়োজন অনুযায়ী কোর্স বেছে নিন এবং দক্ষতা অর্জন শুরু করুন।
        </p>
      </div>

      <div className="bg-muted rounded-lg p-6 mb-12 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative col-span-1 md:col-span-2 lg:col-span-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="কোর্স অথবা প্রশিক্ষক খুঁজুন..." 
                className="pl-10 h-12 text-base w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="সব ক্যাটাগরি" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="সব লেভেল" />
                </SelectTrigger>
                <SelectContent>
                    {levels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={price} onValueChange={setPrice}>
                <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="সব দাম" />
                </SelectTrigger>
                <SelectContent>
                    {priceRanges.map(range => <SelectItem key={range} value={range}>{range}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <Card key={i}>
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="p-4 flex justify-between items-center">
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-10 w-1/2" />
                    </CardFooter>
                </Card>
            ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
            ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <ListFilter className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4"/>
            <h3 className="text-2xl font-bold">কোনো কোর্স পাওয়া যায়নি</h3>
            <p className="text-muted-foreground mt-2">আপনার সার্চ বা ফিল্টার পরিবর্তন করে দেখুন।</p>
        </div>
      )}
    </div>
  );
}
