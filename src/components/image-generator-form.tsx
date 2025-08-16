
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { generateImage } from "@/app/ai-tools/image-generator/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <ImageIcon className="mr-2 h-5 w-5" />
          Generate Image
        </>
      )}
    </Button>
  );
}

export default function ImageGeneratorForm() {
  const initialState = { message: "", imageUrl: "", issues: [], fields: {} };
  const [state, formAction] = useActionState(generateImage, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "Error",
            description: state.message,
        })
    }
  }, [state, toast]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Image Generation Prompt</CardTitle>
        <CardDescription>
          Describe the image you want to create in detail.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              name="prompt"
              placeholder="e.g., A minimalist logo for a brand called 'Skill Sprout', featuring a single green sprout growing from a digital circuit. Clean, modern, vector art."
              defaultValue={state.fields?.prompt}
              required
              rows={5}
            />
            {state.issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
          </div>
          <SubmitButton />
        </form>

        {useFormStatus().pending && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg">
                    <p className="text-muted-foreground animate-pulse">Generating your image, this may take a moment...</p>
                </div>
            </div>
        )}

        {state.imageUrl && !useFormStatus().pending &&(
          <div className="mt-8">
            <h3 className="text-2xl font-bold font-headline mb-4 text-center">Generated Image</h3>
            <Card className="bg-muted/50 relative overflow-hidden">
                <Image src={state.imageUrl} alt="Generated image" width={1024} height={1024} className="w-full object-contain"/>
            </Card>
            <Button asChild className="w-full mt-4" size="lg">
                <a href={state.imageUrl} download="generated-image.png">
                    Download Image
                </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
