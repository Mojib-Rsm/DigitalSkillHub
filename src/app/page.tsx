

import HomePageClient from "@/components/home-page-client";
import { getActiveCoupons } from "@/services/coupon-service";
import { getPricingPlans } from '@/services/pricing-service';
import { getTestimonials } from '@/services/testimonial-service';
import { getTrendingTools } from '@/services/tool-service';

// This is the main server component for the root page.
// It fetches all necessary data on the server and then passes it
// as props to the client component responsible for rendering the UI.
// This pattern optimizes for performance (fast initial load with server-rendered HTML)
// while allowing for client-side interactivity in the child component.
export default async function Home() {
    const [pricingPlans, testimonials, trendingTools, activeCoupons] = await Promise.all([
        getPricingPlans(),
        getTestimonials(),
        getTrendingTools(4),
        getActiveCoupons(),
    ]);

    return (
        <HomePageClient 
            pricingPlans={pricingPlans} 
            testimonials={testimonials} 
            trendingTools={trendingTools} 
            activeCoupons={activeCoupons}
        />
    );
}

