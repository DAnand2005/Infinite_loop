
'use client';

import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  MessageSquareMore,
  LifeBuoy,
  Settings,
  LogOut,
  ClipboardList,
  CalendarClock,
  PlusCircle,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuth } from '@/components/auth-provider';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';
import type { GenerateReminderEmailOutput } from '@/ai/flows/generate-reminder-email';

type Reminder = GenerateReminderEmailOutput & {
  id: string;
  interviewId: string;
  sendAt: string;
  recipient: string;
};

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/meeting-room',
    label: 'Meeting Room',
    icon: Video,
  },
  {
    href: '/dashboard/questions',
    label: 'Question Generator',
    icon: MessageSquareMore,
  },
  {
    href: '/dashboard/feedback',
    label: 'Meeting History',
    icon: ClipboardList,
  },
  {
    href: '/dashboard/upcoming',
    label: 'Upcoming Interviews',
    icon: CalendarClock,
  },
  {
    href: '/dashboard/new-interview',
    label: 'New Interview',
    icon: PlusCircle,
  },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await auth.signOut();
    router.push('/login');
  };

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const dueReminders = reminders.filter(r => new Date(r.sendAt) <= now);

      if (dueReminders.length > 0) {
        dueReminders.forEach(reminder => {
          toast({
            title: "Reminder Sent!",
            description: `A reminder email for your interview was just sent to ${reminder.recipient}.`,
          });
           // Log the simulated email for debugging
          console.log(`--- SIMULATING REMINDER EMAIL ---`);
          console.log(`To: ${reminder.recipient}`);
          console.log(`Subject: ${reminder.subject}`);
          console.log(`Body:\n${reminder.body}`);
          console.log(`---------------------------------`);
        });

        // Remove the reminders that have been sent
        setReminders(reminders.filter(r => new Date(r.sendAt) > now));
      }
    };
    // Check reminders on initial load and whenever the user navigates
    checkReminders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]); // Rerun on navigation

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Support">
                <LifeBuoy />
                <span>Support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <div className="flex items-center gap-3 p-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
                        <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-semibold">{user?.displayName}</span>
                        <span className="text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">Welcome back, {user?.displayName?.split(' ')[0]}!</p>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
