
import { getPackageBySlug, getPackages } from '@/services/package-service';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';

// Generate static paths for all packages
export async function generateStaticParams() {
  const packages = await getPackages();
  return packages.map((pkg) => ({
    slug: pkg.slug,
  }));
}

const iconMap: { [key: string]: React.ElementType } = {
    PenSquare: require('lucide-react').PenSquare,
    ShoppingCart: require('lucide-react').ShoppingCart,
    Languages: require('lucide-react').Languages,
    Hash: require('lucide-react').Hash,
    Briefcase: require('lucide-react').Briefcase,
    Mail: require('lucide-react').Mail,
    Lightbulb: require('lucide-react').Lightbulb,
    FileText: require('lucide-react').FileText,
    GraduationCap: require('lucide-react').GraduationCap,
    HelpCircle: require('lucide-react').HelpCircle,
    BookCheck: require('lucide-react').BookCheck,
    ImageIcon: require('lucide-react').Image,
    DollarSign: require('lucide-react').DollarSign,
    Wand: require('lucide-react').Wand,
    FileSignature: require('lucide-react').FileSignature,
    Globe: require('lucide-react').Globe,
    Film: require('lucide-react').Film,
    MessageSquare: require('lucide-react').MessageSquare,
    UserCircle: require('lucide-react').UserCircle,
    Edit: require('lucide-react').Edit,
    Sparkles: require('lucide-react').Sparkles,
    Clapperboard: require('lucide-react').Clapperboard,
    Receipt: require('lucide-react').Receipt,
    LayoutTemplate: require('lucide-react').LayoutTemplate,
    Megaphone: require('lucide-react').Megaphone,
    Youtube: require('lucide-react').Youtube,
    GitBranchPlus: require('lucide-react').GitBranchPlus,
    Mic: require('lucide-react').Mic,
    List: require('lucide-react').List,
    PanelTopOpen: require('lucide-react').PanelTopOpen,
    CalendarDays: require('lucide-react').CalendarDays,
    BarChart2: require('lucide-react').BarChart2,
    Search: require('lucide-react').Search,
    Palette: require('lucide-react').Palette,
    Stamp: require('lucide-react').Stamp,
    Asterisk: require('lucide-react').Asterisk,
    Newspaper: require('lucide-react').Newspaper,
};


export default async function PackagePage({
  params,
}: {
  params: { slug: string };
}) {
  const pkg = await getPackageBySlug(params.slug);

  if (!pkg) {
    notFound();
  }

  const PkgIcon = pkg.icon;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
          <PkgIcon className="w-12 h-12 text-primary" />
        </div>
        <h1 className="font-headline text-5xl font-bold">{pkg.title}</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {pkg.description}
        </p>
         <p className="text-primary font-semibold mt-4 max-w-2xl mx-auto">
          {pkg.useCase}
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          এই প্যাকেজে অন্তর্ভুক্ত টুলস
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pkg.tools.map((tool) => {
            const ToolIcon = tool.icon ? iconMap[tool.icon] || Bot : Bot;
            return (
              <Link href={tool.href} key={tool.id} className="group">
                <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:border-primary transition-all duration-300 transform hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <ToolIcon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </CardContent>
                  <CardContent className="flex justify-end pt-4">
                     <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
