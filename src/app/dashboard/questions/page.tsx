import { PageHeader } from '@/components/page-header';
import { QuestionGenerator } from './components/question-generator';
import { FeedbackReport } from '../feedback/[id]/components/feedback-report';
import { Separator } from '@/components/ui/separator';

export default function QuestionGeneratorPage() {
  return (
    <div>
      <PageHeader
        title="AI Insights"
        description="Generate targeted questions and review past interview feedback."
      />
      <div className="max-w-4xl mx-auto space-y-12">
        <QuestionGenerator />
        <Separator />
        <div>
           <h2 className="text-2xl font-semibold font-headline mb-4">
            Interview Feedback Report
          </h2>
           <p className="text-muted-foreground mb-6">Here is a sample analysis of an interview performance. This will be populated with your data after you complete an interview.</p>
          <FeedbackReport />
        </div>
      </div>
    </div>
  );
}
