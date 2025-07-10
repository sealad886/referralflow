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
import { Switch } from "@/components/ui/switch";
import { Patient } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

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
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            <Input
              id="dob"
              value={editedPatient.dob}
              onChange={handleInputChange}
              className="col-span-3"
              disabled={!isEditMode}
            />
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
