import { InterviewSimulation } from "./components/interview-simulation";

export default function InterviewPage({ params }: { params: { id: string } }) {
  return <InterviewSimulation interviewId={params.id} />;
}
