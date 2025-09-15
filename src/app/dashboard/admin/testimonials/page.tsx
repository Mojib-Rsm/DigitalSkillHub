
import { getTestimonials } from "@/services/testimonial-service";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import TestimonialsDataTable from "@/components/testimonials-data-table";

export default async function TestimonialsAdminPage() {
    const testimonials = await getTestimonials();
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Admin: Testimonial Management</h1>
                <p className="text-muted-foreground">
                    Add, edit, and manage all user testimonials displayed on your homepage.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>All Testimonials</CardTitle>
                    <CardDescription>
                        A list of all user testimonials. You can edit, delete, or add new ones here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <TestimonialsDataTable initialTestimonials={testimonials} />
                </CardContent>
            </Card>
        </div>
    )
}
