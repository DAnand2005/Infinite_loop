import { PageHeader } from '@/components/page-header';
import { NewInterviewForm } from './components/new-interview-form';

export default function NewInterviewPage() {
  return (
    <div>
      <PageHeader
        title="New Mock Interview"
        description="Upload your resume and the job description to start a new session."
      />
      <div className="max-w-2xl mx-auto">
        <NewInterviewForm />
      </div>
    </div>
  );
}
