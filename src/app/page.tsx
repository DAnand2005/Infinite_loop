'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CheckCircle, Bot, LineChart, BookUser } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

const features = [
  {
    icon: <BookUser className="h-8 w-8 text-primary" />,
    title: 'Resume Parsing',
    description: 'Upload your resume and job description to get started. Our AI analyzes your profile to tailor the interview.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Interviewer',
    description: 'Engage with our smart AI interviewer that asks relevant questions based on your background and the job role.',
  },
  {
    icon: <LineChart className="h-8 w-8 text-primary" />,
    title: 'Instant Feedback',
    description: 'Receive a detailed report on your performance, highlighting your strengths and areas for improvement.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Personalized Questions',
    description: 'Generate targeted questions based on your resume to practice and address potential weaknesses beforehand.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image-1');
  const dashboardLink = user ? '/dashboard' : '/login';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-headline text-primary">AI Mock Interviewer</h1>
          <nav>
            <Button asChild variant="ghost">
              <Link href={dashboardLink}>Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href={dashboardLink}>Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
                  Ace Your Next Interview with AI
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our platform provides realistic mock interviews tailored to your resume and desired job. Get instant, actionable feedback to land your dream job.
                </p>
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={dashboardLink}>Start Your Free Interview</Link>
                </Button>
              </div>
              <div>
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl object-cover"
                    data-ai-hint={heroImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h3 className="text-3xl md:text-4xl font-bold font-headline">How It Works</h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A simple, three-step process to transform your interview skills.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="pt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI Mock Interviewer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
