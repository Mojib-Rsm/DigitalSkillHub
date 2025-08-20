
"use client";

import React from "react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { extractHandwritingAction } from "@/app/ai-tools/handwriting-extractor/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Edit, X, Download, FileText, FileSpreadsheet, FileJson, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Textarea } from "./ui/textarea";

// We need these packages for file generation
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable
interface jsPDFWithAutoTable extends jsPDF {
    autoTable: (options: any) => jsPDF;
}


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
         <>
          <Sparkles className="mr-2 h-5 w-5 animate-spin" />
          লেখা এক্সট্র্যাক্ট করা হচ্ছে...
        </>
      ) : (
        <>
          <Edit className="mr-2 h-5 w-5" />
          টেক্সট এক্সট্র্যাক্ট করুন
        </>
      )}
    </Button>
  );
}

export default function HandwritingExtractorForm() {
  const initialState = { message: "", issues: [], data: undefined };
  const [state, formAction] = useActionState(extractHandwritingAction, initialState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [outputFormat, setOutputFormat] = useState("excel");
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== "success" && state.message !== "Validation Error") {
        toast({
            variant: "destructive",
            title: "ত্রুটি",
            description: state.message,
        })
    }
  }, [state, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const invalidFiles = fileArray.some(file => file.size > 5 * 1024 * 1024);
      if (invalidFiles) {
          toast({
              variant: "destructive",
              title: "ফাইল খুবই বড়",
              description: "প্রতিটি ছবির আকার 5MB এর বেশি হতে পারবে না।",
          });
          if(fileInputRef.current) fileInputRef.current.value = "";
          setPreviewUrls([]);
          return;
      }
      const urls = fileArray.map(file => URL.createObjectURL(file));
      setPreviewUrls(urls);
    } else {
      setPreviewUrls([]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    // This is tricky with file inputs. The best we can do is clear it.
    // A better solution would involve a custom file management state.
    if(fileInputRef.current) fileInputRef.current.value = "";
    toast({
        title: "Image removed",
        description: "Please re-select your files if you need to add more.",
        variant: "default"
    })
  }
  
  const handleDownload = () => {
    if (!state.data) return;

    const { isTable, extractedTable, extractedText } = state.data;
    
    if (isTable) {
        const worksheet = XLSX.utils.aoa_to_sheet(extractedTable);
        
        if (outputFormat === 'excel') {
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "extracted_data.xlsx");
        } else if (outputFormat === 'csv') {
            const csv = XLSX.utils.sheet_to_csv(worksheet);
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", "extracted_data.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (outputFormat === 'pdf') {
            const doc = new jsPDF() as jsPDFWithAutoTable;
            doc.autoTable({
                head: extractedTable.length > 0 ? [extractedTable[0]] : [],
                body: extractedTable.length > 1 ? extractedTable.slice(1) : [],
            });
            doc.save('extracted_data.pdf');
        } else if (outputFormat === 'word') {
             const tableHtml = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>Export HTML to Word</title></head>
                <body><table>${extractedTable.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</table></body></html>`;
             const blob = new Blob([tableHtml], { type: 'application/msword' });
             const link = document.createElement("a");
             link.href = URL.createObjectURL(blob);
             link.setAttribute("download", "extracted_data.doc");
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
        }

    } else { // It's plain text
        let blob;
        let filename;
        if (outputFormat === 'pdf') {
            const doc = new jsPDF();
            doc.text(extractedText, 10, 10);
            doc.save('extracted_text.pdf');
            return;
        } else if (outputFormat === 'word') {
            blob = new Blob([extractedText], { type: 'application/msword' });
            filename = 'extracted_text.doc';
        } else { // Treat as .txt for excel/csv selection
            blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8;' });
            filename = 'extracted_text.txt';
        }
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>ছবি থেকে টেক্সট এক্সট্র্যাক্ট করুন</CardTitle>
        <CardDescription>
          আপনার হাতে লেখা নোটের এক বা একাধিক পরিষ্কার ছবি আপলোড করুন এবং আউটপুট ফরম্যাট নির্বাচন করুন।
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-2">
                <Label htmlFor="photos">আপনার ছবি (সর্বোচ্চ 5MB প্রতিটি)</Label>
                <Input
                    id="photos"
                    name="photos"
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    multiple
                />
                {previewUrls.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                        {previewUrls.map((url, index) => (
                             <div key={index} className="relative w-full h-24 border rounded-md">
                                <Image src={url} alt={`Image preview ${index + 1}`} layout="fill" className="rounded-md object-contain"/>
                                <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveImage(index)} className="absolute -top-2 -right-2 h-6 w-6 rounded-full">
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                {state.issues?.map((issue) => <p key={issue} className="text-sm font-medium text-destructive">{issue}</p>)}
              </div>
              <div className="space-y-2">
                <Label>আউটপুট ফরম্যাট</Label>
                <RadioGroup name="outputFormat" defaultValue="excel" onValueChange={setOutputFormat} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="excel" id="excel" className="peer sr-only" />
                    <Label htmlFor="excel" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <FileSpreadsheet className="mb-3 h-6 w-6"/>
                        Excel (.xlsx)
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="word" id="word" className="peer sr-only" />
                    <Label htmlFor="word" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <FileText className="mb-3 h-6 w-6"/>
                        Word (.doc)
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="csv" id="csv" className="peer sr-only" />
                    <Label htmlFor="csv" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <FileJson className="mb-3 h-6 w-6"/>
                        CSV (.csv)
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
                    <Label htmlFor="pdf" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <FileDown className="mb-3 h-6 w-6"/>
                        PDF (.pdf)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          
          <SubmitButton />
        </form>

        {useFormStatus().pending && (
             <div className="mt-8 text-center">
                <div className="inline-block bg-muted/50 p-4 rounded-lg animate-pulse">
                    <p className="text-muted-foreground">আপনার ছবি(গুলো) বিশ্লেষণ করা হচ্ছে... এটি কিছু সময় নিতে পারে।</p>
                </div>
            </div>
        )}

        {state.data && !useFormStatus().pending &&(
          <div className="mt-8 space-y-6">
            <h3 className="text-2xl font-bold font-headline text-center">এক্সট্র্যাক্ট করা ডেটা</h3>
            <Card className="bg-muted/50">
                <CardHeader>
                    <CardTitle className="text-lg">এআই-এর ব্যাখ্যা</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground italic">{state.data.explanation}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>ফলাফলের প্রিভিউ</CardTitle>
                </CardHeader>
                <CardContent>
                    {state.data.isTable ? (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {state.data.extractedTable[0]?.map((header, i) => <TableHead key={i}>{header}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {state.data.extractedTable.slice(1).map((row, i) => (
                                        <TableRow key={i}>
                                            {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <Textarea value={state.data.extractedText} readOnly rows={10} className="bg-background"/>
                    )}
                </CardContent>
            </Card>
            
            <Button onClick={handleDownload} size="lg" className="w-full">
                <Download className="mr-2 h-5 w-5" />
                ডাউনলোড করুন ({outputFormat.toUpperCase()})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
