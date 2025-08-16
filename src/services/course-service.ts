
export type Course = {
    title: string;
    category: string;
    instructor: string;
    price: number;
    level: string;
    duration: string;
    image: string;
    dataAiHint: string;
};

const allCourses: Course[] = [
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

export function getCourses(): Course[] {
    return allCourses;
}
