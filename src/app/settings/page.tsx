
import { AppLayout } from "@/components/app-layout";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { List, ListItem, ListIcon, ListContent, ListTitle, ListSubtitle } from "@/components/ui/list";
import { Smartphone, Laptop, LogOut, KeyRound, QrCode, type LucideIcon } from "lucide-react";

const loggedInDevices: {
    id: string;
    type: string;
    icon: keyof typeof import("lucide-react");
    browser: string;
    location: string;
    lastActive: string;
    isCurrent: boolean;
}[] = [
    {
        id: "1",
        type: "Laptop",
        icon: "Laptop",
        browser: "Chrome on macOS",
        location: "New York, NY",
        lastActive: "Active now",
        isCurrent: true,
    },
    {
        id: "2",
        type: "Smartphone",
        icon: "Smartphone",
        browser: "iPhone App",
        location: "Chicago, IL",
        lastActive: "2 hours ago",
        isCurrent: false,
    },
    {
        id: "3",
        type: "Laptop",
        icon: "Laptop",
        browser: "Firefox on Windows",
        location: "Seattle, WA",
        lastActive: "1 day ago",
        isCurrent: false,
    }
]

export default function SettingsPage() {
  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-3xl">Settings</h1>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" defaultValue="Jane" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" defaultValue="Doe" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jane.doe@clinic.com" />
                </div>
              </form>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Save Profile</Button>
            </CardFooter>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeSwitcher />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account's security settings, including multi-factor authentication and active sessions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {/* MFA Section */}
                <div className="flex flex-col sm:flex-row items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <KeyRound className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold">Multi-Factor Authentication (MFA)</h3>
                        <p className="text-sm text-muted-foreground">Add an additional layer of security to your account.</p>
                        <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <QrCode className="h-8 w-8"/>
                                    <div>
                                        <p className="font-medium">Authenticator App</p>
                                        <p className="text-sm text-green-600 dark:text-green-400">Enabled</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Manage</Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logged-in Devices Section */}
                <div>
                  <h3 className="font-semibold text-lg">Logged-in Devices</h3>
                  <p className="text-sm text-muted-foreground mb-4">You are currently logged in on these devices. You can log out of any session.</p>
                  <List>
                    {loggedInDevices.map(device => (
                        <ListItem key={device.id}>
                            <ListIcon icon={device.icon} />
                            <ListContent>
                                <ListTitle>{device.browser}</ListTitle>
                                <ListSubtitle>{device.location} - <span className={device.isCurrent ? "text-green-600" : ""}>{device.lastActive}</span></ListSubtitle>
                            </ListContent>
                            {!device.isCurrent && (
                                <Button variant="ghost" size="sm">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </Button>
                            )}
                        </ListItem>
                    ))}
                  </List>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button variant="outline">Log out all other devices</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Manage global security policies for the entire organization. (Admin only)
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
               <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="global-mfa" className="flex flex-col space-y-1">
                  <span>Enforce Global MFA</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Require all users in the organization to use Multi-Factor Authentication.
                  </span>
                </Label>
                <Switch id="global-mfa" />
              </div>
              <Separator />
               <div>
                  <Label htmlFor="token-expiration">Auth Token Expiration</Label>
                  <p className="text-sm text-muted-foreground mb-2">Set how long a user's session remains active before they need to log in again.</p>
                  <Input id="token-expiration" type="number" placeholder="e.g., 30" className="w-48" />
                  <span className="ml-2 text-sm text-muted-foreground">days</span>
               </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
              <Button>Save Security Policies</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how you receive notifications from the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                  <span>Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive an email for new referrals and status updates.
                  </span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                  <span>Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get push notifications on your mobile device.
                  </span>
                </Label>
                <Switch id="push-notifications" />
              </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4">
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}
