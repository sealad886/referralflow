
"use client";

import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  List,
  ListItem,
  ListIcon,
  ListContent,
  ListTitle,
  ListSubtitle,
} from "@/components/ui/list";
import { cn } from "@/lib/utils";
import { referrals, ReferralStatus } from "@/lib/mock-data";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Link as LinkIcon,
  MessageSquareWarning,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

const doneStatuses: ReferralStatus[] = ["Completed", "Cancelled", "Canceled by referrer", "Refused by referred", "Patient declined"];

const ongoingReferrals = referrals.filter(r => !doneStatuses.includes(r.status) && !r.isDraft).length;
const completedThisMonth = referrals.filter(r => r.status === 'Completed' && new Date(r.date).getMonth() === new Date().getMonth()).length;
const requiresAction = referrals.filter(r => r.status === 'Pending').length;

const metrics: {title: string; value: string; icon: keyof typeof import("lucide-react"), color: string}[] = [
  {
    title: "Ongoing Referrals",
    value: ongoingReferrals.toString(),
    icon: "Briefcase",
    color: "text-blue-500",
  },
  {
    title: "Completed This Month",
    value: completedThisMonth.toString(),
    icon: "CheckCircle2",
    color: "text-green-500",
  },
  {
    title: "Avg. Time to Complete",
    value: "7.2 days",
    icon: "Clock",
    color: "text-yellow-500",
  },
  {
    title: "Requires Action",
    value: requiresAction.toString(),
    icon: "AlertTriangle",
    color: "text-red-500",
  },
];

const updates = [
  {
    icon: "CheckCircle2",
    title: "Referral REF001 Completed",
    subtitle: "Cardiology referral for John Smith marked as complete.",
    time: "2h ago",
    unread: true,
  },
  {
    icon: "Activity",
    title: "Status Update on REF006",
    subtitle: "Status changed to 'In Progress' for Sarah Davis.",
    time: "1d ago",
    unread: true,
  },
  {
    icon: "ClipboardList",
    title: "New Note on REF002",
    subtitle: "Dr. Ben Carter added a new clinical note.",
    time: "3d ago",
    unread: false,
  },
];

const actionItems = [
    {
        icon: "MessageSquareWarning",
        title: "Follow up on REF003",
        subtitle: "No update in 7 days for Michael Williams (Neurology).",
        priority: "alert",
    },
    {
        icon: "AlertTriangle",
        title: "STAT Referral Pending",
        subtitle: "REF005 for David Miller (Pediatrics) is awaiting acceptance.",
        priority: "critical",
    },
    {
        icon: "Clock",
        title: "Review old referral",
        subtitle: "REF007 for John Smith has been pending for over 5 days.",
        priority: "reminder",
    }
]

const resources = [
  {
    icon: "BookOpen",
    title: "Clinical Guidelines",
    subtitle: "Access the latest referral guidelines and protocols.",
  },
  {
    icon: "LinkIcon",
    title: "External Partners Directory",
    subtitle: "Contact information for external clinics and hospitals.",
  },
];

const priorityClasses: { [key: string]: string } = {
    reminder: "border-l-4 border-blue-500",
    alert: "border-l-4 border-yellow-500",
    critical: "border-l-4 border-red-500",
};

export default function DashboardPage() {
  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-semibold text-3xl">Dashboard</h1>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* My Referrals Metrics */}
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>My Referrals</CardTitle>
              <CardDescription>
                An overview of your referral activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon as keyof typeof import("lucide-react");
                return (
                  <Card key={metric.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      <ListIcon icon={Icon} className={cn("h-8 w-8", metric.color)} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </CardContent>
          </Card>
          
          {/* Requires Action */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Requires Action</CardTitle>
                <CardDescription>
                  Tasks and referrals needing your attention.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                  <Link href="#">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <List>
                {actionItems.map((item, index) => (
                  <ListItem key={index} className={cn(priorityClasses[item.priority], "pl-4")}>
                    <ListIcon icon={item.icon as keyof typeof import("lucide-react")} />
                    <ListContent>
                      <ListTitle>{item.title}</ListTitle>
                      <ListSubtitle>{item.subtitle}</ListSubtitle>
                    </ListContent>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
          
          {/* Updates */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>My Referral Updates</CardTitle>
              <CardDescription>Recent activity on your referrals.</CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                {updates.map((item, index) => (
                  <ListItem key={index} unread={item.unread}>
                    <ListIcon icon={item.icon as keyof typeof import("lucide-react")} />
                    <ListContent>
                      <ListTitle>{item.title}</ListTitle>
                      <ListSubtitle>{item.subtitle}</ListSubtitle>
                    </ListContent>
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Department Metrics */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Department Metrics</CardTitle>
              <CardDescription>
                Key metrics for the Cardiology department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for charts or more complex data */}
              <p className="text-sm text-muted-foreground">Department-level analytics will be shown here.</p>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Resources</CardTitle>
              <CardDescription>Quick links to important resources.</CardDescription>
            </CardHeader>
            <CardContent>
              <List>
                {resources.map((item, index) => (
                  <ListItem key={index}>
                    <ListIcon icon={item.icon as keyof typeof import("lucide-react")} />
                    <ListContent>
                      <ListTitle>{item.title}</ListTitle>
                    </ListContent>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
