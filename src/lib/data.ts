export type Interview = {
  id: string;
  role: string;
  company: string;
  date: string;
  status: 'Scheduled' | 'Completed';
};

export const mockInterviews: Interview[] = [
  {
    id: '1',
    role: 'Senior Frontend Developer',
    company: 'TechCorp',
    date: '2024-08-15T14:00:00Z',
    status: 'Scheduled',
  },
  {
    id: '2',
    role: 'Product Manager',
    company: 'Innovate Inc.',
    date: '2024-08-12T10:00:00Z',
    status: 'Completed',
  },
  {
    id: '3',
    role: 'Data Scientist',
    company: 'DataDriven Co.',
    date: '2024-07-28T11:30:00Z',
    status: 'Completed',
  },
  {
    id: '4',
    role: 'UX/UI Designer',
    company: 'Creative Solutions',
    date: '2024-08-20T09:00:00Z',
    status: 'Scheduled',
  },
];
