
"use client";

import { AppLayout } from "@/components/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
} from "@/components/ui/timeline";
import { User, Edit, FilePlus, ArrowLeft } from "lucide-react";
import { referrals } from "@/lib/mock-data";
import { notFound, useRouter } from "next/navigation";

// Mock history data for a referral
const mockHistory = [
  {
    id: 1,
    user: "Dr. Evelyn Reed",
    action: "Created Referral",
    timestamp: "2023-10-26T10:00:00Z",
    details: "Referred John Smith to Cardiology for Atrial Fibrillation.",
    icon: FilePlus,
  },
  {
    id: 2,
    user: "Dr. Jane Doe",
    action: "Added Clinical Note",
    timestamp: "2023-10-27T15:30:00Z",
    details: "Patient reports feeling better after starting medication.",
    icon: Edit,
  },
  {
    id: 3,
    user: "Dr. Jane Doe",
    action: "Updated Status",
    timestamp: "2023-10-28T09:00:00Z",
    details: "Status changed from 'Pending' to 'In Progress'.",
    icon: Edit,
  },
  {
    id: 4,
    user: "System",
    action: "Marked as Completed",
    timestamp: "2023-10-29T11:45:00Z",
    details: "The referral process was marked as completed.",
    icon: User,
  },
];


export default function ReferralHistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const referral = referrals.find(r => r.id === params.id);

  if (!referral) {
    notFound();
  }

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
           <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="font-semibold text-3xl">Referral History</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Log for Referral #{referral.id}</CardTitle>
            <CardDescription>
              A detailed audit trail of all actions and changes for the referral of <span className="font-medium">{referral.patient.name}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline>
              {mockHistory.map((event, index) => (
                <TimelineItem key={event.id}>
                  <TimelineConnector />
                  <TimelineHeader>
                    <TimelineIcon>
                      <event.icon className="h-4 w-4" />
                    </TimelineIcon>
                    <TimelineTitle>{event.action}</TimelineTitle>
                    <TimelineDescription>
                      {new Date(event.timestamp).toLocaleString()} by {event.user}
                    </TimelineDescription>
                  </TimelineHeader>
                  <TimelineContent>
                     <p className="text-sm text-muted-foreground">{event.details}</p>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
