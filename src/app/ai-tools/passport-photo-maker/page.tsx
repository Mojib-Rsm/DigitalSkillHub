
import PassportPhotoMakerForm from "@/components/passport-photo-maker-form";
import ToolPageLayout from "@/components/tool-page-layout";
import { UserCircle } from "lucide-react";

export default function PassportPhotoMakerPage() {
  return (
    <ToolPageLayout
        title="পাসপোর্ট সাইজ ছবি মেকার"
        description="আপনার ছবি আপলোড করুন এবং একটি পেশাদার পাসপোর্ট সাইজ ছবি তৈরি করুন।"
        icon={<UserCircle className="w-12 h-12 text-primary" />}
    >
        <PassportPhotoMakerForm />
    </ToolPageLayout>
  );
}
