
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // কনফিগারেশন অপশনস এখানে
  typescript: {
    // শুধুমাত্র প্রোডাকশন বিল্ডে ত্রুটি উপেক্ষা করুন।
    // ডেভেলপমেন্টের সময় টাইপস্ক্রিপ্ট ত্রুটি ঠিক করা ভালো।
    ignoreBuildErrors: true, 
  },
  eslint: {
    // শুধুমাত্র প্রোডাকশন বিল্ডে ত্রুটি উপেক্ষা করুন।
    // ডেভেলপমেন্টের সময় ESLint ত্রুটি ঠিক করা ভালো।
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    // 'dangerouslyAllowSVG: true' একটি নিরাপত্তা ঝুঁকি, যদি আপনি SVG ফাইলগুলির উৎস সম্পর্কে নিশ্চিত না হন।
    // 'contentSecurityPolicy' এর মতো সুরক্ষা ব্যবস্থা ব্যবহার করা ভাল।
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // অনিরাপদ ওয়াইল্ডকার্ড ('**') এর পরিবর্তে নির্দিষ্ট ডোমেইন যোগ করুন।
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      // যদি অন্য কোন ডোমেইন থেকে ছবি লাগে, তাহলে এখানে যোগ করতে পারেন।
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
  webpack: (config, { isServer }) => {
    // এই ওয়েবপ্যাক কনফিগারেশনটি হ্যান্ডেলবার্স বাগ ঠিক করার জন্য।
    config.resolve.alias.handlebars = 'handlebars/dist/handlebars.min.js';
    
    return config;
  },
};

export default nextConfig;
