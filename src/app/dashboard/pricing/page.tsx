
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
    return (
        <section id="pricing" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                  <Badge variant="secondary" className="text-sm py-1 px-3 border-2 border-primary/50 text-primary mb-4">
                      🔥 Limited Time Launch Offer - 25% OFF with LAUNCH25
                  </Badge>
                  <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
                      Choose Your AI Content Creation Plan
                  </h2>
                  <p className="text-lg text-muted-foreground mt-4">
                      Start with our free trial, then scale with plans designed for creators, marketers, and agencies
                  </p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary"/> 4 Free Articles to Try</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary"/> No Credit Card Required</div>
                      <div className="flex items-center justify-center gap-2 text-muted-foreground"><CheckCircle className="w-5 h-5 text-primary"/> Cancel Anytime</div>
                  </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {/* Alpha Plan */}
                  <Card className="shadow-lg flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300">
                      <CardHeader>
                          <CardTitle className="text-2xl font-bold">Alpha Plan</CardTitle>
                          <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-bold text-primary">৳499</p>
                              <p className="text-xl font-medium text-muted-foreground line-through">৳665</p>
                              <Badge variant="destructive">25% OFF</Badge>
                          </div>
                          <p className="text-muted-foreground pt-2">Kickstart your content journey with powerful AI tools and essential automation.</p>
                          <p className="text-sm text-accent font-semibold">Use code: LAUNCH25 at checkout</p>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                          <div className="bg-muted p-3 rounded-lg text-center">
                              <p className="text-lg font-bold">100 Credits</p>
                              <p className="text-sm text-muted-foreground">Valid for 15 Days</p>
                          </div>
                          <div className="space-y-3 text-sm">
                              <h4 className="font-semibold text-base">Core Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> AI-Powered Featured Image Generation</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Deep Content Research</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> One-Click Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Automated Internal Linking</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> News Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Seamless WordPress Publishing</li>
                              </ul>
                              <h4 className="font-semibold text-base pt-2">Advanced Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Topic Authority Cluster Builder</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Enhanced In-Content AI Images</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Content Refresh Tool</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Bulk Generation Tool</li>
                              </ul>
                          </div>
                      </CardContent>
                      <CardFooter>
                          <Button size="lg" className="w-full" asChild>
                            <Link href="/#pricing">GET STARTED</Link>
                          </Button>
                      </CardFooter>
                  </Card>

                  {/* Beta Plan - Most Popular */}
                  <Card className="shadow-lg flex flex-col h-full border-2 border-primary relative transform hover:-translate-y-2 transition-transform duration-300">
                       <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">MOST POPULAR + 25% OFF</Badge>
                      <CardHeader>
                          <CardTitle className="text-2xl font-bold">Beta Plan</CardTitle>
                          <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-bold text-primary">৳1499</p>
                              <p className="text-xl font-medium text-muted-foreground line-through">৳1998</p>
                              <Badge variant="destructive">25% OFF</Badge>
                          </div>
                          <p className="text-muted-foreground pt-2">Scale up your output and get first dibs on future upgrades.</p>
                           <p className="text-sm text-accent font-semibold">Use code: LAUNCH25 at checkout</p>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                           <div className="bg-primary/10 p-3 rounded-lg text-center">
                              <p className="text-lg font-bold text-primary">300 Credits</p>
                              <p className="text-sm text-muted-foreground">Valid for 1 Month</p>
                          </div>
                          <div className="space-y-3 text-sm">
                              <h4 className="font-semibold text-base">Core Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> AI-Powered Featured Image Generation</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Deep Content Research</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> One-Click Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Automated Internal Linking</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> News Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Seamless WordPress Publishing</li>
                              </ul>
                              <h4 className="font-semibold text-base pt-2">Advanced Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Topic Authority Cluster Builder</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Enhanced In-Content AI Images</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Content Refresh Tool</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Bulk Generation Tool</li>
                              </ul>
                               <h4 className="font-semibold text-base pt-2">Premium Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Early Access to Upcoming Features</li>
                              </ul>
                          </div>
                      </CardContent>
                      <CardFooter>
                           <Button size="lg" className="w-full" asChild>
                             <Link href="/#pricing">GET STARTED</Link>
                           </Button>
                      </CardFooter>
                  </Card>

                  {/* Sigma Plan */}
                  <Card className="shadow-lg flex flex-col h-full transform hover:-translate-y-2 transition-transform duration-300">
                      <CardHeader>
                          <CardTitle className="text-2xl font-bold">Sigma Plan</CardTitle>
                          <div className="flex items-baseline gap-2">
                              <p className="text-4xl font-bold text-primary">৳4999</p>
                              <p className="text-xl font-medium text-muted-foreground line-through">৳6665</p>
                              <Badge variant="destructive">25% OFF</Badge>
                          </div>
                          <p className="text-muted-foreground pt-2">Our most generous package for power users and agencies.</p>
                           <p className="text-sm text-accent font-semibold">Use code: LAUNCH25 at checkout</p>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-4">
                           <div className="bg-muted p-3 rounded-lg text-center">
                              <p className="text-lg font-bold">1,000 Credits</p>
                              <p className="text-sm text-muted-foreground">Valid for 2 Months</p>
                          </div>
                           <div className="space-y-3 text-sm">
                              <h4 className="font-semibold text-base">Core Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> AI-Powered Featured Image Generation</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Deep Content Research</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> One-Click Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Automated Internal Linking</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> News Article Generator</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Seamless WordPress Publishing</li>
                              </ul>
                              <h4 className="font-semibold text-base pt-2">Advanced Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Topic Authority Cluster Builder</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Enhanced In-Content AI Images</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Content Refresh Tool</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Bulk Generation Tool</li>
                              </ul>
                               <h4 className="font-semibold text-base pt-2">Premium Features</h4>
                              <ul className="space-y-2">
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Early Access to Upcoming Features</li>
                                  <li className="flex items-center gap-2 text-muted-foreground"><Check className="w-4 h-4 text-green-500" /> Custom Feature Requests</li>
                              </ul>
                          </div>
                      </CardContent>
                      <CardFooter>
                          <Button size="lg" className="w-full" asChild>
                            <Link href="/#pricing">GET STARTED</Link>
                          </Button>
                      </CardFooter>
                  </Card>
              </div>

              {/* Free Trial CTA */}
              <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10">
                  <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                          <CardTitle className="text-2xl font-bold">Start Free - Write 4 Articles! 🎉</CardTitle>
                          <p className="text-muted-foreground mt-2 max-w-2xl">No credit card required. Test all features with 4 complete articles including AI images. Then upgrade with <strong className="text-primary">LAUNCH25</strong> for 25% OFF!</p>
                           <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> Full feature access</div>
                              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> AI images included</div>
                              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> WordPress publishing</div>
                          </div>
                      </div>
                      <Button size="lg" className="text-base shrink-0" asChild>
                        <Link href="/free-trial">Start Writing for FREE</Link>
                      </Button>
                  </CardContent>
              </Card>
              
              {/* bKash Payment */}
              <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">Pay with</p>
                   <div className="flex justify-center items-center gap-2 mt-2">
                      <svg className="h-8" viewBox="0 0 1024 372.48" xmlns="http://www.w3.org/2000/svg"><path d="M789.28 206.01c-6.22-9.45-14.28-17.51-24.16-24.16-29.4-19.8-67.65-27.42-105.1-27.42-83.82 0-155.22 55.45-180.12 131.25H259.9a185.53 185.53 0 0 1 185.16-184.81c50.78 0 96.84 19.89 130.82 51.69a183.88 183.88 0 0 1 51.51 130.64h-74.01a113.88 113.88 0 0 0-50.1-107.19z" fill="#D82A7D"/><path d="M575.83 293.36a110.87 110.87 0 0 0-21.57 2.37A111.43 111.43 0 0 0 445.89 404H244.66a185.53 185.53 0 0 1 327-133.4 114.1 114.1 0 0 0-38.33-22.95 183.85 183.85 0 0 1-57.5 145.71z" fill="#D82A7D"/><path d="M837.74 34.33h-134.3v271.85a33.15 33.15 0 0 0 33.15 33.15h101.15V34.33z" fill="#D82A7D"/><path d="M1024 34.33H889.67v305h101.18a33.15 33.15 0 0 0 33.15-33.15V34.33z" fill="#D82A7D"/><path d="M0 34.33h201.23v305H0z" fill="#D82A7D"/><path d="M371.84 34.33H237.5v305h134.34a33.15 33.15 0 0 0 33.15-33.15V67.48a33.15 33.15 0 0 0-33.15-33.15z" fill="#D82A7D"/></svg>
                      <p className="text-muted-foreground font-semibold">Easy mobile payments available for Bangladeshi users</p>
                   </div>
              </div>
          </div>
      </section>
    );
}
