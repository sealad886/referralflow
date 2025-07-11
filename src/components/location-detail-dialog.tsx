"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  locations,
  Location,
  LocationType,
  LocationSettings,
} from "@/lib/mock-data";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Trash2, PlusCircle } from "lucide-react";

interface LocationDetailDialogProps {
  location: Location | null;
  isOpen: boolean;
  onDialogClose: (refresh?: boolean) => void;
}

const getParentOptions = (currentLocationId?: string): Location[] => {
    // A location cannot be its own parent.
    return locations.filter(l => l.id !== currentLocationId);
}

export function LocationDetailDialog({
  location,
  isOpen,
  onDialogClose,
}: LocationDetailDialogProps) {
  const [editedLocation, setEditedLocation] = React.useState<Partial<Location>>(
    {}
  );
  const { toast } = useToast();

  const isNew = !location;

  React.useEffect(() => {
    if (isOpen) {
      setEditedLocation(
        location
          ? { ...location }
          : { type: "Department", settings: [] }
      );
    }
  }, [location, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    settingId?: string
  ) => {
    const { id, value } = e.target;
    if (settingId) {
      // It's a setting change
      setEditedLocation((prev) => ({
        ...prev,
        settings: (prev.settings || []).map((s) =>
          s.id === settingId ? { ...s, [id]: value } : s
        ),
      }));
    } else {
      // It's a location property change
      setEditedLocation((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (field: keyof Location, value: string) => {
    setEditedLocation((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSetting = () => {
    const newSetting: LocationSettings = {
        id: `setting_${Date.now()}`, // Temporary unique ID
        name: "",
        value: "",
        description: "",
    };
    setEditedLocation(prev => ({
        ...prev,
        settings: [...(prev.settings || []), newSetting]
    }));
  };
  
  const handleRemoveSetting = (settingId: string) => {
    setEditedLocation(prev => ({
        ...prev,
        settings: (prev.settings || []).filter(s => s.id !== settingId)
    }));
  }

  const handleSave = () => {
    // In a real app, this would be an API call
    console.log("Saving location:", editedLocation);
    toast({
      title: isNew ? "Location Created" : "Location Updated",
      description: `Location "${editedLocation.name}" has been saved.`,
    });
    onDialogClose(true); // Close and indicate a refresh is needed
  };

  const parentOptions = React.useMemo(() => getParentOptions(location?.id), [location]);

  return (
    <Dialog open={isOpen} onOpenChange={onDialogClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Location" : "Edit Location"}</DialogTitle>
          <DialogDescription>
            Manage the details for this location and its specific settings.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-1">
          <div className="grid gap-6 py-4 pr-6">
            <section>
              <h3 className="font-semibold text-lg mb-4">Location Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    value={editedLocation.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="type">Location Type</Label>
                  <Select
                    value={editedLocation.type}
                    onValueChange={(val) =>
                      handleSelectChange("type", val as LocationType)
                    }
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
                {editedLocation.type === "Department" && (
                  <div className="md:col-span-2 space-y-1">
                    <Label htmlFor="parentId">Parent Location</Label>
                    <Select
                      value={editedLocation.parentId || ""}
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
            </section>

            <Separator />
            
            <section>
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold text-lg">Specific Settings</h3>
                 <Button variant="outline" size="sm" onClick={handleAddSetting}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Setting
                 </Button>
              </div>
              <div className="space-y-4">
                {(editedLocation.settings || []).length > 0 ? (
                    (editedLocation.settings || []).map((setting, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => handleRemoveSetting(setting.id)}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                            <div className="grid grid-cols-2 gap-4">
                               <div className="space-y-1">
                                    <Label htmlFor={`name-${setting.id}`}>Setting Name</Label>
                                    <Input id="name" value={setting.name} onChange={(e) => handleInputChange(e, setting.id)} />
                               </div>
                               <div className="space-y-1">
                                    <Label htmlFor={`value-${setting.id}`}>Value</Label>
                                    <Input id="value" value={String(setting.value)} onChange={(e) => handleInputChange(e, setting.id)} />
                               </div>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor={`description-${setting.id}`}>Description</Label>
                                <Input id="description" value={setting.description} onChange={(e) => handleInputChange(e, setting.id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No specific settings. This location will inherit all settings from its parent.</p>
                )}
              </div>
            </section>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          {!isNew && (
            <Button
              type="button"
              variant="destructive"
              className="mr-auto"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Location Deleted",
                  description: `Location "${location.name}" has been deleted.`,
                });
                onDialogClose(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Location
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => onDialogClose()}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {isNew ? "Create Location" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}