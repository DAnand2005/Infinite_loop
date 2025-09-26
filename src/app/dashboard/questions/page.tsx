import { PageHeader } from '@/components/page-header';
import { QuestionGenerator } from './components/question-generator';

export default function QuestionGeneratorPage() {
  return (
    <div>
      <PageHeader
        title="Personalized Question Generator"
        description="Paste your resume to generate targeted interview questions that address potential weaknesses."
      />
      <div className="max-w-4xl mx-auto">
        <QuestionGenerator />
      </div>
    </div>
  );
}
