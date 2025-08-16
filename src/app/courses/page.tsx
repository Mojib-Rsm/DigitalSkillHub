
"use client";

import { useState } from 'react';
import CourseCard from "@/components/course-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ListFilter } from "lucide-react";

const allCourses = [
  {
    title: "স্মার্টফোন ও ইন্টারনেট বেসিকস",
    category: "Digital Literacy",
    instructor: "Digital Skill Hub",
    price: 0,
    level: "Beginner",
    duration: "4 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "smartphone learning",
  },
  {
    title: "বাংলায় ফ্রিল্যান্সিং শুরু",
    category: "Freelancing",
    instructor: "Abul Kalam",
    price: 49.99,
    level: "Beginner",
    duration: "12 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "freelancing laptop home",
  },
  {
    title: "ফেসবুক ও হোয়াটসঅ্যাপে ব্যবসা",
    category: "E-commerce",
    instructor: "Fatima Akhtar",
    price: 29.99,
    level: "Beginner",
    duration: "8 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "social media business",
  },
  {
    title: "হস্তশিল্প ও অনলাইন সেলস",
    category: "Home Business",
    instructor: "Rahima Begum",
    price: 39.99,
    level: "Intermediate",
    duration: "10 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "handmade crafts market",
  },
  {
    title: "স্ক্রিন রিডার ও ভয়েস টাইপিং",
    category: "Assistive Technology",
    instructor: "Jahanara Alam",
    price: 0,
    level: "Beginner",
    duration: "6 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "assistive technology computer",
  },
  {
    title: "ঘরে বসে খাবারের ব্যবসা",
    category: "Home Business",
    instructor: "Amina Khatun",
    price: 35.00,
    level: "Beginner",
    duration: "7 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "home cooking business",
  },
  {
    title: "অনলাইন টেইলরিং শপ",
    category: "Home Business",
    instructor: "Sultana Razia",
    price: 45.00,
    level: "Intermediate",
    duration: "15 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "sewing machine fabric",
  },
  {
    title: "দারাজ শপ ম্যানেজমেন্ট",
    category: "E-commerce",
    instructor: "Robiul Islam",
    price: 59.99,
    level: "Intermediate",
    duration: "10 hours",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "online store package",
  },
];


const categories = ["All", ...new Set(allCourses.map(c => c.category))];
const levels = ["All", ...new Set(allCourses.map(c => c.level))];
const priceRanges = ["All", "Free", "Under $50", "$50 - $100"];

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
      
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
            <CourseCard key={course.title} course={course} />
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
