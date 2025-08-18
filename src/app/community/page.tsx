
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, DollarSign, PlusCircle, UserCheck } from "lucide-react";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { app } from "@/lib/firebase";

type JobPosting = {
    id: string;
    title: string;
    client: string;
    avatar: string;
    dataAiHint: string;
    budget: string;
    skills: string[];
};

async function getJobPostings(): Promise<JobPosting[]> {
  try {
    const db = getFirestore(app);
    const jobsCol = collection(db, 'jobs');
    const jobSnapshot = await getDocs(jobsCol);
    const jobList = jobSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JobPosting));
    return jobList;
  } catch (error) {
    console.error("Error fetching job postings from Firestore:", error);
    return [];
  }
}

export default async function CommunityPage() {
  const jobPostings = await getJobPostings();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
        <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="font-headline text-5xl font-bold">কমিউনিটি ও কাজের সুযোগ</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              এখানে ছোট ছোট কাজ খুঁজে নিন এবং আয় করা শুরু করুন।
            </p>
        </div>
        <Button size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          নতুন কাজ পোস্ট করুন
        </Button>
      </div>

      <div className="space-y-4">
        {jobPostings.map((job) => (
          <Card key={job.id} className="hover:border-primary transition-all duration-200 shadow-sm hover:shadow-md">
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={job.avatar} alt={job.client} data-ai-hint={job.dataAiHint} />
                  <AvatarFallback>{job.client.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg hover:text-primary">
                    <Link href="#">{job.title}</Link>
                  </h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <UserCheck className="w-4 h-4"/> 
                    <span>{job.client}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    {job.skills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 shrink-0 ml-16 sm:ml-0">
                 <div className="flex items-center gap-2 text-lg font-bold text-primary">
                  <DollarSign className="w-5 h-5" />
                  <span>{job.budget}</span>
                </div>
                <Button>
                    <Briefcase className="mr-2 h-4 w-4"/>
                    আবেদন করুন
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
