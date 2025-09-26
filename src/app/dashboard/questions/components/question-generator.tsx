'use client';

import { generateQuestionsAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Lightbulb, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function QuestionGenerator() {
  const [resumeText, setResumeText] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setQuestions([]);

    const result = await generateQuestionsAction({ resumeText });

    if (result.success && result.data) {
      setQuestions(result.data.questions);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Generate Questions</CardTitle>
            <CardDescription>
              Paste your full resume text below to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Your resume text goes here..."
              rows={15}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              required
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !resumeText.trim()}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              {isLoading ? 'Generating...' : 'Generate Questions'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-4 text-muted-foreground">
            Our AI is analyzing your resume...
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>
              Here are some questions tailored to your resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {questions.map((q, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium">{q}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
