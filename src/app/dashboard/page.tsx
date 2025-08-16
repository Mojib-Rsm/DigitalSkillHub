import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, BookCopy, BarChart, Users, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, BarChart as RechartsBarChart } from "@/components/ui/chart";
import { Bar } from "recharts";

const enrolledCourses = [
  { title: "Modern Web Development", progress: 75 },
  { title: "Introduction to AI Tools", progress: 40 },
  { title: "Freelancing on Upwork", progress: 95 },
];

const achievements = [
  { title: "Course Connoisseur", description: "Complete 5 courses" },
  { title: "Web Wizard", description: "Finish the Web Dev track" },
  { title: "Perfect Start", description: "Complete your first lesson" },
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
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
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
              <CardContent className="flex flex-wrap gap-4">
                {achievements.map(ach => (
                  <Badge key={ach.title} variant="secondary" className="text-lg py-2 px-4 border-2 border-accent/50">
                    <Award className="w-4 h-4 mr-2 text-accent" />
                    {ach.title}
                  </Badge>
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
                      <RechartsBarChart accessibilityLayer data={chartData}>
                        <Bar dataKey="students" fill="var(--color-students)" radius={4} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsBarChart>
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
