import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { notifications, NotificationEvent } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const getBadgeVariant = (type: NotificationEvent['type']) => {
    switch (type) {
      case 'Email Sent':
        return 'default';
      case 'Status Update':
        return 'secondary';
      case 'New Referral':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-3xl">Notification Manager</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Event Log</CardTitle>
            <CardDescription>
              A log of all automated notifications and system events.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant={getBadgeVariant(event.type)}>
                        {event.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{event.details}</TableCell>
                    <TableCell>{event.recipient}</TableCell>
                    <TableCell>{event.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
