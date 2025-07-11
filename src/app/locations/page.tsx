"use client";

import * as React from "react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  ChevronRight,
  PlusCircle,
  FileCog,
} from "lucide-react";
import {
  locations,
  Location,
  LocationSettings,
  LocationType,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LocationNode = Location & { children: LocationNode[] };

export default function LocationsPage() {
  const router = useRouter();
  const [tree, setTree] = React.useState<LocationNode[]>([]);
  const [simulatedLocation, setSimulatedLocation] = React.useState<Location | null>(null);
  const [effectiveSettings, setEffectiveSettings] = React.useState<LocationSettings[]>([]);

  React.useEffect(() => {
    const buildTree = (
      items: Location[],
      parentId: string | null = null
    ): LocationNode[] => {
      return items
        .filter((item) => item.parentId === parentId)
        .map((item) => ({
          ...item,
          children: buildTree(items, item.id),
        }));
    };
    setTree(buildTree(locations));
  }, []);
  
  const getParentSettings = (locationId: string): LocationSettings[] => {
    const location = locations.find(l => l.id === locationId);
    if (!location || !location.parentId) return [];
    
    const parent = locations.find(l => l.id === location.parentId);
    if (!parent) return [];
    
    const parentEffectiveSettings = getParentSettings(parent.id);
    const parentOwnSettings = parent.settings;
    
    // Parent's own settings override its inherited settings
    const effective = [...parentEffectiveSettings];
    parentOwnSettings.forEach(ownSetting => {
      const index = effective.findIndex(s => s.id === ownSetting.id);
      if (index > -1) {
        effective[index] = ownSetting;
      } else {
        effective.push(ownSetting);
      }
    });

    return effective;
  }

  React.useEffect(() => {
    if (simulatedLocation) {
        const inheritedSettings = getParentSettings(simulatedLocation.id);
        const ownSettings = simulatedLocation.settings;

        const allSettings = [...inheritedSettings.map(s => ({...s, isInherited: true}))];

        ownSettings.forEach(ownSetting => {
            const index = allSettings.findIndex(s => s.id === ownSetting.id);
            if (index > -1) {
                // Override inherited setting
                allSettings[index] = { ...ownSetting, isInherited: false };
            } else {
                // Add new setting
                allSettings.push({ ...ownSetting, isInherited: false });
            }
        });

        setEffectiveSettings(allSettings);
    } else {
        setEffectiveSettings([]);
    }
  }, [simulatedLocation]);

  const renderTree = (nodes: LocationNode[], level = 0) => {
    return nodes.map((node) => (
      <Collapsible key={node.id} className="w-full" defaultOpen={level < 1}>
        <div
          className="flex items-center gap-2 hover:bg-accent p-2 rounded-md"
          style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        >
          {node.children.length > 0 ? (
            <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0 group">
                  <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                </Button>
            </CollapsibleTrigger>
          ) : (
            <span className="w-6 h-6" />
          )}

          <div
            className="flex-1 flex items-center gap-4 cursor-pointer"
            onClick={() => router.push(`/locations/${node.id}`)}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-secondary-foreground",
                node.type === "Facility" ? "bg-primary/20" : "bg-secondary"
              )}
            >
              <Building className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{node.name}</p>
              <p className="text-sm text-muted-foreground">{node.type}</p>
            </div>
          </div>
           <Button asChild variant="ghost" size="icon" className="h-8 w-8">
             <Link href={`/locations/${node.id}`}>
               <FileCog className="h-4 w-4" />
             </Link>
           </Button>
        </div>
        <CollapsibleContent>
            {node.children.length > 0 && renderTree(node.children, level + 1)}
        </CollapsibleContent>
      </Collapsible>
    ));
  };

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-3xl">Locations</h1>
           <Button asChild>
            <Link href="/locations/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Location
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Organizational Structure</CardTitle>
                    <CardDescription>
                        Manage facilities, departments, and their hierarchy.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {tree.length > 0 ? renderTree(tree) : <p>Loading locations...</p>}
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Settings Simulator</CardTitle>
                    <CardDescription>
                        See how settings are inherited and overridden for a location.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Select onValueChange={(locId) => setSimulatedLocation(locations.find(l => l.id === locId) || null)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a location to simulate..." />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map(loc => (
                                    <SelectItem key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {simulatedLocation && (
                        <div className="space-y-4 pt-4 border-t">
                            <h4 className="font-medium">Effective Settings for "{simulatedLocation.name}"</h4>
                            <ul className="space-y-3">
                                {effectiveSettings.map(setting => (
                                    <li key={setting.id} className="flex items-start gap-4 p-2 border rounded-md">
                                        <div className={cn("mt-1 h-2 w-2 rounded-full flex-shrink-0", setting.isInherited ? "bg-muted-foreground" : "bg-primary")}></div>
                                        <div className="flex-1">
                                            <p className="font-medium leading-tight">{setting.name}</p>
                                            <p className="text-xs text-muted-foreground">{setting.isInherited ? "Inherited" : "Overridden"}</p>
                                        </div>
                                        <p className="text-sm font-mono bg-muted px-2 py-1 rounded-md">{String(setting.value)} {setting.unit || ""}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </AppLayout>
  );
}
