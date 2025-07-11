"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  locations,
  Location,
  LocationType,
  LocationSettings,
} from "@/lib/mock-data";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Bell,
  Network,
  Trash2,
  PlusCircle,
  FileText,
  Clock,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const settingGroups: {
  id: string;
  title: string;
  icon: LucideIcon;
  settings: string[];
}[] = [
  {
    id: "general",
    title: "General",
    icon: Settings,
    settings: ["Default Referral Deadline", "Urgent Referral Deadline"],
  },
  {
    id: "rules",
    title: "Workflow Rules",
    icon: Network,
    settings: ["Requires Pre-authorization", "Auto-accept transfers"],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    settings: ["Escalate after", "Remind after"],
  },
];

export default function LocationSettingsForm({
  id,
}: {
  id: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const isNew = id === "new";

  const [location, setLocation] = React.useState<Partial<Location> | null>(
    null
  );
  const [activeGroup, setActiveGroup] = React.useState("general");

  React.useEffect(() => {
    if (isNew) {
      setLocation({
        id: `loc_${Date.now()}`,
        name: "",
        type: "Department",
        parentId: null,
        settings: [],
      });
    } else {
      const foundLocation = locations.find((l) => l.id === id);
      if (foundLocation) {
        setLocation(foundLocation);
      } else {
        notFound();
      }
    }
  }, [id, isNew]);
  
  const handleInputChange = (field: keyof Location, value: string) => {
    setLocation(prev => prev ? {...prev, [field]: value} : null);
  };
  
  const handleSelectChange = (field: keyof Location, value: string) => {
    setLocation(prev => prev ? {...prev, [field]: value} : null);
  }
  
  const handleSettingChange = (settingId: string, value: string | number | boolean) => {
     setLocation(prev => {
        if (!prev) return null;
        const existingSettings = prev.settings || [];
        const settingIndex = existingSettings.findIndex(s => s.id === settingId);
        
        let newSettings: LocationSettings[];
        if (settingIndex > -1) {
            // Update existing setting
            newSettings = existingSettings.map((s, index) => index === settingIndex ? {...s, value} : s);
        } else {
            // This case would be for adding new settings, not covered by this UI
            newSettings = [...existingSettings];
        }
        return {...prev, settings: newSettings};
     });
  }

  const getSettingValue = (settingName: string) => {
    return location?.settings?.find(s => s.name === settingName)?.value ?? '';
  }

  const handleSave = () => {
    console.log("Saving location:", location);
    toast({
      title: isNew ? "Location Created" : "Location Updated",
      description: `Location "${location?.name}" has been saved.`,
    });
    router.push("/locations");
  };

  if (!location) {
    return null; // or a loading skeleton
  }

  const parentOptions = locations.filter(l => l.id !== location.id);

  return (
    <AppLayout>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="font-semibold text-3xl">
              {isNew ? "New Location" : location.name}
            </h1>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground">
            {settingGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                  activeGroup === group.id && "bg-muted text-primary"
                )}
              >
                <group.icon className="h-4 w-4" />
                {group.title}
              </button>
            ))}
          </nav>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
                <CardDescription>
                  Basic information about this location.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Location Name</Label>
                    <Input id="name" value={location.name || ""} onChange={(e) => handleInputChange('name', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="type">Location Type</Label>
                    <Select
                      value={location.type as LocationType}
                      onValueChange={(val) => handleSelectChange("type", val)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Facility">Facility</SelectItem>
                        <SelectItem value="Department">Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {location.type === "Department" && (
                    <div className="md:col-span-2 space-y-1">
                      <Label htmlFor="parentId">Parent Location</Label>
                      <Select
                        value={location.parentId || ""}
                        onValueChange={(val) => handleSelectChange("parentId", val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a parent location" />
                        </SelectTrigger>
                        <SelectContent>
                          {parentOptions.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {opt.name} ({opt.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Override Settings</CardTitle>
                    <CardDescription>
                        These settings will override any inherited values from parent locations. Leave blank to inherit.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   {/* This is a simplified example. A real implementation might map over setting definitions */}
                    <div className="flex items-center justify-between">
                         <div className="space-y-1">
                           <Label htmlFor="deadline" className="font-semibold">Default Referral Deadline</Label>
                           <p className="text-sm text-muted-foreground">Time frame for routine referrals to be completed.</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Input id="deadline" type="number" value={getSettingValue('Default Referral Deadline') as number} onChange={(e) => handleSettingChange(locations[0].settings[0].id, e.target.value)} className="w-24" placeholder="Inherited"/>
                           <span className="text-sm text-muted-foreground">days</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                         <div className="space-y-1">
                           <Label htmlFor="urgent-deadline" className="font-semibold">Urgent Referral Deadline</Label>
                           <p className="text-sm text-muted-foreground">Time frame for urgent referrals to be completed.</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Input id="urgent-deadline" type="number" value={getSettingValue('Urgent Referral Deadline') as number}  onChange={(e) => handleSettingChange(locations[0].settings[1].id, e.target.value)} className="w-24" placeholder="Inherited"/>
                           <span className="text-sm text-muted-foreground">days</span>
                        </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                         <div className="space-y-1">
                           <Label htmlFor="pre-auth" className="font-semibold">Requires Pre-authorization</Label>
                           <p className="text-sm text-muted-foreground">If referrals to this location require pre-authorization.</p>
                        </div>
                        <Switch id="pre-auth" checked={getSettingValue('Requires Pre-authorization') as boolean} onCheckedChange={(val) => handleSettingChange(locations[3].settings[1].id, val)} />
                    </div>

                </CardContent>
                <CardFooter className="border-t px-6 py-4 justify-end">
                    <Button onClick={handleSave}>Save Changes</Button>
                </CardFooter>
            </Card>
            
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
