
import { Layers, RefreshCcw, Sparkles, TowerControl, Users, Youtube, Clock, TrendingUp, Award, CheckCircle, FileText, ImageIcon, Link as LinkIcon } from 'lucide-react';


export const allCourses = [
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

export const blogPosts = [
  {
    title: "10 Essential Skills for Modern Web Developers",
    category: "Web Development",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "developer computer code",
    author: "Jane Doe",
    date: new Date("2024-07-16").toISOString(),
    excerpt: "The web development landscape is always evolving. Here are the 10 skills you need to stay ahead of the curve in today's market.",
  },
  {
    title: "The Rise of AI: How to Leverage AI Tools for Productivity",
    category: "AI Tools",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "artificial intelligence brain",
    author: "Sarah Green",
    date: new Date("2024-07-12").toISOString(),
    excerpt: "Artificial intelligence is no longer science fiction. Discover practical AI tools that can automate tasks and boost your productivity.",
  },
  {
    title: "Building a Strong Freelance Profile That Wins Clients",
    category: "Freelancing",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "freelancer laptop cafe",
    author: "Michael Brown",
    date: new Date("2024-07-10").toISOString(),
    excerpt: "Your freelance profile is your digital storefront. Learn the secrets to crafting a compelling profile that attracts high-value clients.",
  },
  {
    title: "Color Theory for Graphic Designers: A Beginner's Guide",
    category: "Graphics Design",
    image: "https://placehold.co/600x400.png",
    dataAiHint: "color wheel design",
    author: "John Smith",
    date: new Date("2024-07-08").toISOString(),
    excerpt: "Understand the fundamentals of color theory to create visually stunning and emotionally resonant designs.",
  }
];

export const jobPostings = [
  {
    title: "ফেসবুক পেজের জন্য সহজ পোস্ট ডিজাইন",
    client: "Local Fashion House",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "fashion logo",
    budget: "৳৫০০",
    skills: ["Canva", "Design"],
  },
  {
    title: "বাংলা ডেটা এন্ট্রি (১০টি পেজ)",
    client: "NGO Health Project",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "ngo logo",
    budget: "৳৮০০",
    skills: ["Data Entry", "Typing"],
  },
  {
    title: "কাস্টমার সাপোর্টের জন্য উত্তর লেখা",
    client: "E-commerce Shop",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "shopping cart icon",
    budget: "৳১০০০",
    skills: ["Communication"],
  },
  {
    title: "হস্তশিল্পের ছবি তোলা ও এডিট করা",
    client: "Crafts Seller",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "handmade craft",
    budget: "৳১২০০",
    skills: ["Photography", "Photo Editing"],
  },
];

export const users = [
    {
        uid: "admin001",
        name: "Admin User",
        email: "admin@totthoai.com",
        phone: "01800000000",
        password: "adminpassword",
        role: "admin",
    },
    {
        uid: "user001",
        name: "Demo User",
        email: "user@totthoai.com",
        phone: "01700000000",
        password: "userpassword",
        role: "user",
    }
];

export const tools = [
    // This data is taken from the /ai-tools page and centralized here.
];

export const pricingPlans = [
    {
        id: "alpha",
        name: "Alpha Plan",
        price: 499,
        originalPrice: 665,
        discount: "25% OFF",
        description: "Kickstart your content journey with powerful AI tools and essential automation.",
        credits: 100,
        validity: "15 Days",
        features: {
            "Core Features": [
                "AI-Powered Featured Image Generation",
                "Deep Content Research",
                "One-Click Article Generator",
                "Automated Internal Linking",
                "News Article Generator",
                "Seamless WordPress Publishing",
            ],
            "Advanced Features": [
                "Topic Authority Cluster Builder",
                "Enhanced In-Content AI Images",
                "Content Refresh Tool",
                "Bulk Generation Tool"
            ],
        },
    },
    {
        id: "beta",
        name: "Beta Plan",
        price: 1499,
        originalPrice: 1998,
        discount: "25% OFF",
        description: "Scale up your output and get first dibs on future upgrades.",
        credits: 300,
        validity: "1 Month",
        isPopular: true,
        features: {
            "Core Features": [
                "AI-Powered Featured Image Generation",
                "Deep Content Research",
                "One-Click Article Generator",
                "Automated Internal Linking",
                "News Article Generator",
                "Seamless WordPress Publishing",
            ],
            "Advanced Features": [
                "Topic Authority Cluster Builder",
                "Enhanced In-Content AI Images",
                "Content Refresh Tool",
                "Bulk Generation Tool"
            ],
            "Premium Features": [
                "Early Access to Upcoming Features"
            ]
        },
    },
    {
        id: "sigma",
        name: "Sigma Plan",
        price: 4999,
        originalPrice: 6665,
        discount: "25% OFF",
        description: "Our most generous package for power users and agencies.",
        credits: 1000,
        validity: "2 Months",
        features: {
            "Core Features": [
                "AI-Powered Featured Image Generation",
                "Deep Content Research",
                "One-Click Article Generator",
                "Automated Internal Linking",
                "News Article Generator",
                "Seamless WordPress Publishing",
            ],
            "Advanced Features": [
                "Topic Authority Cluster Builder",
                "Enhanced In-Content AI Images",
                "Content Refresh Tool",
                "Bulk Generation Tool"
            ],
            "Premium Features": [
                "Early Access to Upcoming Features",
                "Custom Feature Requests"
            ]
        },
    }
];

export const testimonials = [
     {
        feature: "Bulk Generation 2.0",
        quote: "TotthoAi 2.0's bulk generation feature is incredible! I created 50 blog posts in one afternoon using the new CSV upload. The AI images are so contextual that my engagement increased by 300%. This is the future of content creation.",
        metric: "300% engagement boost",
        authorName: "Tanvir Ahmed",
        authorRole: "Content Creator & Blogger",
        avatar: "https://placehold.co/40x40.png",
        dataAiHint: "man portrait"
    },
    {
        feature: "Content Refresh Tool",
        quote: "The Content Refresh tool saved my business! I had 200+ old articles that needed updating. TotthoAi 2.0 refreshed them all with current information and better SEO in just 2 hours. My organic traffic doubled in 3 weeks.",
        metric: "2x organic traffic",
        authorName: "Sharmin Akter",
        authorRole: "Education Platform Owner",
        avatar: "https://placehold.co/40x40.png",
        dataAiHint: "woman portrait"
    },
    {
        feature: "Authority Builder",
        quote: "The Topical Authority Builder is a game-changer! It created a complete content cluster around 'digital marketing in Bangladesh' with 25 interconnected articles. We now rank #1 for multiple keywords and our domain authority increased by 15 points.",
        metric: "15 point DA increase",
        authorName: "Fahim Rahman",
        authorRole: "News Website Owner",
        avatar: "https://placehold.co/40x40.png",
        dataAiHint: "man glasses"
    },
    {
        feature: "One-Click Writer 2.0",
        quote: "One-Click Writer 2.0 is pure magic! My team generates client content 10x faster now. The custom prompts feature ensures every piece matches our clients' brand voice perfectly. We've scaled from 5 to 50 clients without hiring more writers.",
        metric: "10x faster content",
        authorName: "Nusrat Jahan",
        authorRole: "Digital Marketing Agency",
        avatar: "https://placehold.co/40x40.png",
        dataAiHint: "woman smiling"
    }
];
