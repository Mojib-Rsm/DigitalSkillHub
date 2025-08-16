
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
  { title: "Modern Web Development", progress: 75 },
  { title: "Introduction to AI Tools", progress: 40 },
  { title: "Freelancing on Upwork", progress: 95 },
];

const achievements = [
  { title: "Digital Starter", description: "Complete your first course" },
  { title: "Freelance Ready", description: "Build your freelance profile" },
  { title: "Perfect Start", description: "Complete your first lesson" },
];

const certificates = [
  { title: "Web Development Fundamentals", date: "June 2024" },
  { title: "AI for Everyone", date: "July 2024" },
];

const mentors = [
    { name: "Jahangir Alam", expertise: "Freelance Web Developer"},
    { name: "Fatima Akhtar", expertise: "E-commerce Specialist"},
];

const liveSessions = [
    { topic: "Client Communication Tips", time: "Wednesday, 7 PM"},
    { topic: "Pricing Your Services", time: "Friday, 8 PM"},
];

const instructorCourses = [
  { title: "Advanced Graphic Design", students: 1204, rating: 4.8 },
  { title: "UI/UX Design Fundamentals", students: 859, rating: 4.9 },
]

const chartData = [
  { month: "January", students: 186 },
  { month: "February", students: 305 },
  { month: "March", students: 237 },
  { month: "April", students: 273 },
  { month: "May", students: 209 },
  { month: "June", students: 214 },
];

const chartConfig = {
  students: {
    label: "Students",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl font-bold">Your Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your learning and teaching journey.</p>
      </div>

      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto h-12">
          <TabsTrigger value="student" className="text-base">Student</TabsTrigger>
          <TabsTrigger value="instructor" className="text-base">Instructor</TabsTrigger>
        </TabsList>

        {/* Student Dashboard */}
        <TabsContent value="student" className="mt-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Courses</CardTitle>
                <BookCopy className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent className="space-y-6">
                {enrolledCourses.map(course => (
                  <div key={course.title}>
                    <p className="font-medium mb-2">{course.title}</p>
                    <Progress value={course.progress} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-1 text-right">{course.progress}% Complete</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>My Achievements</CardTitle>
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
                <CardTitle>My Certificates</CardTitle>
                <FileText className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                {certificates.map(cert => (
                  <div key={cert.title} className="flex justify-between items-center mb-2 pb-2 border-b last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <p className="font-semibold">{cert.title}</p>
                      <p className="text-sm text-muted-foreground">Issued: {cert.date}</p>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Find a Mentor</CardTitle>
                <Users className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                 {mentors.map(mentor => (
                  <div key={mentor.name} className="flex justify-between items-center mb-2 pb-2 border-b last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <p className="font-semibold">{mentor.name}</p>
                      <p className="text-sm text-muted-foreground">{mentor.expertise}</p>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Live Q&A Sessions</CardTitle>
                <MessageCircle className="w-6 h-6 text-primary" />
              </CardHeader>
              <CardContent>
                 {liveSessions.map(session => (
                  <div key={session.topic} className="flex justify-between items-center mb-2 pb-2 border-b last:border-0 last:pb-0 last:mb-0">
                    <div>
                      <p className="font-semibold">{session.topic}</p>
                      <p className="text-sm text-muted-foreground">{session.time}</p>
                    </div>
                    <Button variant="outline" size="sm">Join</Button>
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
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Monthly new student enrollments</CardDescription>
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
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,540</div>
                        <p className="text-xs text-muted-foreground">+12.4% from last month</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.85</div>
                        <p className="text-xs text-muted-foreground">Across all courses</p>
                    </CardContent>
                </Card>
              </div>
            </div>
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle>My Courses</CardTitle>
                    <CardDescription>Manage your published courses.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Course</TableHead>
                                <TableHead>Students</TableHead>
                                <TableHead>Rating</TableHead>
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
