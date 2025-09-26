import { PageHeader } from '@/components/page-header';
import { QuestionGenerator } from './components/question-generator';

export default function QuestionGeneratorPage() {
  return (
    <div>
      <PageHeader
        title="AI Question Generator"
        description="Generate targeted interview questions by pasting your resume below."
      />
      <div className="max-w-4xl mx-auto space-y-12">
        <QuestionGenerator />
      </div>
    </div>
  );
}
