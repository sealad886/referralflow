"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Patient } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PatientDetailDialogProps {
  patient: Patient;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function PatientDetailDialog({
  patient,
  isOpen,
  onOpenChange,
}: PatientDetailDialogProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedPatient, setEditedPatient] = React.useState(patient);
  const { toast } = useToast();

  React.useEffect(() => {
    setEditedPatient(patient);
    setIsEditMode(false);
  }, [patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedPatient((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEditedPatient((prev) => ({ ...prev, dob: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleSave = () => {
    // Here you would typically call an API to save the patient data.
    // For this mock, we'll just show a toast.
    console.log("Saving patient:", editedPatient);
    toast({
      title: "Patient Record Saved",
      description: `Changes for ${editedPatient.name} have been saved.`,
    });
    onOpenChange(false);
  };
  
  const handleCancel = () => {
    setEditedPatient(patient);
    setIsEditMode(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleCancel();
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Patient Record</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Editing" : "Viewing"} patient details for {patient.name}.
              </DialogDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="edit-mode">Edit Mode</Label>
              <Switch
                id="edit-mode"
                checked={isEditMode}
                onCheckedChange={setIsEditMode}
              />
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              Patient ID
            </Label>
            <Input id="id" value={editedPatient.id} className="col-span-3" disabled />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={editedPatient.name}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={!isEditMode}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              Date of Birth
            </Label>
             <Popover>
              <PopoverTrigger asChild disabled={!isEditMode}>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !editedPatient.dob && "text-muted-foreground"
                  )}
                  disabled={!isEditMode}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedPatient.dob ? format(new Date(editedPatient.dob), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={new Date(editedPatient.dob)}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Input
              id="gender"
              value={editedPatient.gender}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={!isEditMode}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!isEditMode}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}