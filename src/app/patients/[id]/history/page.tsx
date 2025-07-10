
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
import { User, Edit, FilePlus, ArrowLeft, Home } from "lucide-react";
import { patients } from "@/lib/mock-data";
import { notFound, useRouter } from "next/navigation";

// Mock history data for a patient
const mockHistory = [
  {
    id: 1,
    user: "Admissions Clerk",
    action: "Created Patient Record",
    timestamp: "2022-08-15T09:00:00Z",
    details: "Patient record created upon first visit.",
    icon: FilePlus,
  },
  {
    id: 2,
    user: "Dr. Evelyn Reed",
    action: "Created Referral",
    timestamp: "2023-10-26T10:00:00Z",
    details: "Referred to Cardiology for Atrial Fibrillation.",
    icon: User,
  },
  {
    id: 3,
    user: "Jane Doe (Self)",
    action: "Updated Address",
    timestamp: "2024-01-20T11:30:00Z",
    details: "Patient updated their home address via the online portal.",
    icon: Home,
  },
];


export default function PatientHistoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const patient = patients.find(p => p.id === params.id);

  if (!patient) {
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
          <h1 className="font-semibold text-3xl">Patient History</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Log for Patient #{patient.id}</CardTitle>
            <CardDescription>
              A detailed audit trail of all actions and changes for <span className="font-medium">{patient.name}</span>.
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
