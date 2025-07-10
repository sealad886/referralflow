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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Referral } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ReferralDetailDialogProps {
  referral: Referral;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ReferralDetailDialog({
  referral,
  isOpen,
  onOpenChange,
}: ReferralDetailDialogProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editedReferral, setEditedReferral] = React.useState(referral);
  const { toast } = useToast();

  React.useEffect(() => {
    setEditedReferral(referral);
    setIsEditMode(false);
  }, [referral]);

  const handleSelectChange = (id: string, value: string) => {
    setEditedReferral((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEditedReferral((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
  };
  
  const handleSave = () => {
    // Here you would typically call an API to save the referral data.
    // For this mock, we'll just show a toast.
    console.log("Saving referral:", editedReferral);
    toast({
      title: "Referral Record Saved",
      description: `Changes for referral ${editedReferral.id} have been saved.`,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditedReferral(referral);
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
              <DialogTitle>Referral Details</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Editing" : "Viewing"} referral {referral.id}.
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
            <Label htmlFor="patientName" className="text-right">
              Patient
            </Label>
            <Input id="patientName" value={editedReferral.patient.name} className="col-span-3" disabled />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Select
              value={editedReferral.department}
              onValueChange={(value) => handleSelectChange('department', value)}
              disabled={!isEditMode}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cardiology">Cardiology</SelectItem>
                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                <SelectItem value="Neurology">Neurology</SelectItem>
                <SelectItem value="Oncology">Oncology</SelectItem>
                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={editedReferral.status}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={!isEditMode}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Canceled by referrer">Canceled by referrer</SelectItem>
                <SelectItem value="Refused by referred">Refused by referred</SelectItem>
                <SelectItem value="Patient declined">Patient declined</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
             <Popover>
                <PopoverTrigger asChild disabled={!isEditMode}>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "col-span-3 justify-start text-left font-normal",
                      !editedReferral.date && "text-muted-foreground"
                    )}
                    disabled={!isEditMode}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedReferral.date ? format(new Date(editedReferral.date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={new Date(editedReferral.date)}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
             <Select
              value={editedReferral.priority}
              onValueChange={(value) => handleSelectChange('priority', value)}
              disabled={!isEditMode}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Routine">Routine</SelectItem>
                <SelectItem value="Urgent">Urgent</SelectItem>
                <SelectItem value="STAT">STAT</SelectItem>
              </SelectContent>
            </Select>
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