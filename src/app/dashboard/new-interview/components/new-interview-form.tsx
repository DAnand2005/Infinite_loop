
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
import { UploadCloud, CalendarPlus, FileText, X, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Interview, mockInterviews } from '@/lib/data';

const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
]

export function NewInterviewForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [companyName, setCompanyName] = useState('');

  const [storedInterviews, setStoredInterviews] = useLocalStorage<Interview[]>('interviews', mockInterviews);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

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
    }
  };
  
  const handleRemoveFile = () => {
    setResumeFile(null);
    const fileInput = document.getElementById('resume-upload') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resumeFile || !date || !time || !jobRole || !companyName) {
        setError("Please fill out all required fields and upload a resume.");
        return;
    }
    setIsSubmitting(true);
    setError(null);
    
    // Combine date and time
    const [hours, minutesPart] = time.split(':');
    const [minutes, modifier] = minutesPart.split(' ');
    let hour = parseInt(hours);
    if (modifier === 'PM' && hour < 12) hour += 12;
    if (modifier === 'AM' && hour === 12) hour = 0;
    const scheduledDate = new Date(date);
    scheduledDate.setHours(hour, parseInt(minutes));

    const newInterview: Interview = {
        id: `interview-${Date.now()}`,
        role: jobRole,
        company: companyName,
        date: scheduledDate.toISOString(),
        status: 'Scheduled',
    };
    
    const formData = new FormData(event.currentTarget);
    formData.append('date', date.toISOString());
    formData.append('time', time);
    
    await scheduleInterviewAction(formData);

    setStoredInterviews([...storedInterviews, newInterview]);

    toast({
        title: 'Interview Scheduled!',
        description: 'Your new mock interview has been added to your dashboard.',
    });
    router.push('/dashboard');
    
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
          <CardDescription>
            Provide your details for a tailored experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
           </div>
           <div className="grid sm:grid-cols-2 gap-4">
             <div className="space-y-2">
                  <Label htmlFor="job-role">Job Role</Label>
                  <Input id="job-role" name="jobRole" value={jobRole} onChange={(e) => setJobRole(e.target.value)} required placeholder="e.g., Senior Frontend Developer"/>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" name="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder="e.g., TechCorp"/>
              </div>
            </div>
           <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="date">Interview Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="time">Interview Time</Label>
                <Select name="time" onValueChange={setTime} value={time}>
                    <SelectTrigger>
                        <Clock className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                        {timeSlots.map(slot => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
           </div>
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
                  <Input id="resume-upload" name="resume" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx" />
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
            
          </div>
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              name="jobDescription"
              placeholder="Paste the job description here..."
              rows={10}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
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
