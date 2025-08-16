
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, BookCopy, Users, Star, User, MessageCircle, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";

const enrolledCourses = [
  { title: "আধুনিক ওয়েব ডেভেলপমেন্ট", progress: 75 },
  { title: "এআই টুলের পরিচিতি", progress: 40 },
  { title: "আপওয়ার্কে ফ্রিল্যান্সিং", progress: 95 },
];

const achievements = [
  { title: "ডিজিটাল স্টার্টার", description: "আপনার প্রথম কোর্স শেষ করুন" },
  { title: "ফ্রিল্যান্স রেডি", description: "আপনার ফ্রিল্যান্স প্রোফাইল তৈরি করুন" },
  { title: "পারফেক্ট স্টার্ট", description: "আপনার প্রথম পাঠ শেষ করুন" },
];

const certificates = [
  { title: "ওয়েব ডেভেলপমেন্ট ফান্ডামেন্টালস", date: "জুন ২০২৪" },
  { title: "সবার জন্য এআই", date: "জুলাই ২০২৪" },
];

const mentors = [
    { name: "জাহাঙ্গীর আলম", expertise: "ফ্রিল্যান্স ওয়েব ডেভেলপার"},
    { name: "ফাতেমা আক্তার", expertise: "ই-কমার্স বিশেষজ্ঞ"},
];

const liveSessions = [
    { topic: "ক্লায়েন্ট কমিউনিকেশন টিপস", time: "বুধবার, সন্ধ্যা ৭টা"},
    { topic: "আপনার পরিষেবার মূল্য নির্ধারণ", time: "শুক্রবার, রাত ৮টা"},
];

const instructorCourses = [
  { title: "অ্যাডভান্সড গ্রাফিক ডিজাইন", students: 1204, rating: 4.8 },
  { title: "ইউআই/ইউএক্স ডিজাইন ফান্ডামেন্টালস", students: 859, rating: 4.9 },
]

const chartData = [
  { month: "জানুয়ারি", students: 186 },
  { month: "ফেব্রুয়ারি", students: 305 },
  { month: "মার্চ", students: 237 },
  { month: "এপ্রিল", students: 273 },
  { month: "মে", students: 209 },
  { month: "জুন", students: 214 },
];

const chartConfig = {
  students: {
    label: "শিক্ষার্থীরা",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">আপনার ড্যাশবোর্ড</h1>
        <p className="text-muted-foreground mt-2">আপনার শেখা এবং শেখানোর যাত্রা পরিচালনা করুন।</p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12">
          <TabsTrigger value="student" className="text-base">শিক্ষার্থী</TabsTrigger>
          <TabsTrigger value="instructor" className="text-base">প্রশিক্ষক</TabsTrigger>
        </TabsList>

        {/* Student Dashboard */}
        <TabsContent value="student" className="mt-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>আমার কোর্সসমূহ</CardTitle>
                <BookCopy className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.map(course => (
                  <div key={course.title}>
                    <p className="font-medium mb-2">{course.title}</p>
                    <Progress value={course.progress} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-1 text-right">{course.progress}% সম্পন্ন</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>আমার অর্জনসমূহ</CardTitle>
                <Award className="w-6 h-6 text-accent" />
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {achievements.map(ach => (
                  <Badge key={ach.title} variant="secondary" className="py-2 px-3 border-2 border-accent/50">
                    <Award className="w-4 h-4 mr-2 text-accent" />
                    {ach.title}
                  </Badge>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>আমার সার্টিফিকেট</CardTitle>
                <FileText className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                {certificates.map(cert => (
                  <div key={cert.title} className="flex justify-between items-center mb-2 pb-2 border-b last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <p className="font-semibold">{cert.title}</p>
                      <p className="text-sm text-muted-foreground">ইস্যু: {cert.date}</p>
                    </div>
                    <Button variant="outline" size="sm">ডাউনলোড</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>একজন মেন্টর খুঁজুন</CardTitle>
                <Users className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                 {mentors.map(mentor => (
                  <div key={mentor.name} className="flex justify-between items-center mb-2 pb-2 border-b last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <p className="font-semibold">{mentor.name}</p>
                      <p className="text-sm text-muted-foreground">{mentor.expertise}</p>
                    </div>
                    <Button variant="outline" size="sm">সংযোগ করুন</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>লাইভ প্রশ্নোত্তর সেশন</CardTitle>
                <MessageCircle className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                 {liveSessions.map(session => (
                  <div key={session.topic} className="flex justify-between items-center mb-2 pb-2 border-b last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <p className="font-semibold">{session.topic}</p>
                      <p className="text-sm text-muted-foreground">{session.time}</p>
                    </div>
                    <Button variant="outline" size="sm">যোগ দিন</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Instructor Dashboard */}
        <TabsContent value="instructor" className="mt-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>কোর্স পারফরম্যান্স</CardTitle>
                  <CardDescription>মাসিক নতুন ছাত্র তালিকাভুক্তি</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-64">
                      <BarChart accessibilityLayer data={chartData}>
                        <Bar dataKey="students" fill="var(--color-students)" radius={4} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </BarChart>
                    </ChartContainer>
                </CardContent>
              </Card>
              <div className="space-y-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">মোট শিক্ষার্থী</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,540</div>
                        <p className="text-xs text-muted-foreground">গত মাস থেকে +12.4%</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">গড় রেটিং</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.85</div>
                        <p className="text-xs text-muted-foreground">সমস্ত কোর্স জুড়ে</p>
                    </CardContent>
                </Card>
              </div>
            </div>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>আমার কোর্সসমূহ</CardTitle>
                    <CardDescription>আপনার প্রকাশিত কোর্স পরিচালনা করুন।</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>কোর্স</TableHead>
                                <TableHead>শিক্ষার্থী</TableHead>
                                <TableHead>রেটিং</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {instructorCourses.map(course => (
                                <TableRow key={course.title}>
                                    <TableCell className="font-medium">{course.title}</TableCell>
                                    <TableCell>{course.students.toLocaleString()}</TableCell>
                                    <TableCell className="flex items-center gap-1">
                                        {course.rating}
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
