'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { scheduleInterviewAction } from '@/lib/actions';
import { UploadCloud, CalendarPlus, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function NewInterviewForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size cannot exceed 5MB.');
        return;
      }
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        setError('Only PDF and DOCX files are allowed.');
        return;
      }
      setError(null);
      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeDataUri(null);
    // Reset file input value
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resumeDataUri) {
        setError("Please upload a resume.");
        return;
    }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    formData.append('resumeDataUri', resumeDataUri);

    const result = await scheduleInterviewAction(formData);

    if (result.success) {
      toast({
        title: 'Interview Scheduled!',
        description: 'Your new mock interview has been added to your dashboard.',
      });
      router.push('/dashboard');
    } else {
      setError(result.error || 'An unknown error occurred.');
      toast({
        title: 'Error',
        description: result.error || 'Failed to schedule interview.',
        variant: 'destructive',
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
          <CardDescription>
            Provide your resume and the job details for a tailored experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume">Upload Resume</Label>
            {!resumeFile ? (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="resume-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">PDF or DOCX (MAX. 5MB)</p>
                  </div>
                  <Input id="resume-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
                </label>
              </div>
            ) : (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted">
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-primary" />
                        <span className="text-sm font-medium truncate">{resumeFile.name}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-6 w-6">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              name="jobDescription"
              placeholder="Paste the job description here..."
              rows={10}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting || !resumeFile}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Scheduling...' : 'Schedule Interview'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}