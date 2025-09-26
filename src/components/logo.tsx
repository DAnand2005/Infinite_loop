import { Bot } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <Bot className="h-8 w-8 text-primary" />
      <span className="text-lg font-bold font-headline whitespace-nowrap group-data-[collapsible=icon]:hidden">
        AI Interviewer
      </span>
    </Link>
  );
}
