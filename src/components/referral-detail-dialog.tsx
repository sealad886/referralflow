"use client";

import * as React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon, History } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
  const [newNote, setNewNote] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    setEditedReferral(referral);
    setNewNote("");
    setIsEditMode(false);
  }, [referral]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setEditedReferral((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setEditedReferral((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setEditedReferral((prev) => ({ ...prev, date: format(date, "yyyy-MM-dd") }));
    }
  };
  
  const handleSave = () => {
    // In a real app, combine newNote with existing notes if needed.
    const finalReferral = {
      ...editedReferral,
      clinicalDetails: newNote 
        ? `${editedReferral.clinicalDetails || ''}\n\n--- Note added on ${new Date().toLocaleString()} ---\n${newNote}`
        : editedReferral.clinicalDetails,
      lastEditedBy: "Dr. Jane Doe", // Placeholder
      lastEditedOn: new Date().toISOString(),
    };
    
    console.log("Saving referral:", finalReferral);
    toast({
      title: "Referral Record Saved",
      description: `Changes for referral ${finalReferral.id} have been saved.`,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditedReferral(referral);
    setIsEditMode(false);
    onOpenChange(false);
    setNewNote("");
  };

  const referredOnDate = referral.date ? format(new Date(referral.date), "PPP") : "N/A";
  const lastEditedOnDate = referral.lastEditedOn ? format(parseISO(referral.lastEditedOn), "PPP 'at' p") : "N/A";
  const isSaveDisabled = !isEditMode && !newNote;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleCancel();
      } else {
        onOpenChange(true);
      }
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Referral Details</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Editing" : "Viewing"} referral {referral.id} for {referral.patient.name}.
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
        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
          {/* Patient and Referral Info */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="space-y-1">
              <Label>Patient</Label>
              <p className="text-sm">{referral.patient.name} (MRN: {referral.patient.id})</p>
            </div>
            <div className="space-y-1">
              <Label>Date of Referral</Label>
              <Input value={referredOnDate} disabled />
            </div>
            <div className="space-y-1">
              <Label>Department</Label>
              <Input value={editedReferral.department} disabled />
            </div>
             <div className="space-y-1">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={editedReferral.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
                disabled={!isEditMode}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Routine">Routine</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="STAT">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedReferral.status}
                onValueChange={(value) => handleSelectChange('status', value)}
                disabled={!isEditMode}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />

          {/* Clinical Information */}
          <h4 className="text-lg font-medium">Clinical Information</h4>
           <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="col-span-2 space-y-1">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input id="diagnosis" value={editedReferral.diagnosis || ''} onChange={handleInputChange} disabled={!isEditMode} />
              </div>
               <div className="space-y-1">
                  <Label htmlFor="side">Side</Label>
                  <Select
                    value={editedReferral.side || ''}
                    onValueChange={(value) => handleSelectChange('side', value)}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger id="side">
                      <SelectValue placeholder="Select side" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Left">Left</SelectItem>
                      <SelectItem value="Right">Right</SelectItem>
                      <SelectItem value="Both">Both</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
               <div className="space-y-1">
                  <Label htmlFor="severity">Severity</Label>
                   <Select
                    value={editedReferral.severity || ''}
                    onValueChange={(value) => handleSelectChange('severity', value)}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mild">Mild</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
                <div className="col-span-2 space-y-1">
                  <Label htmlFor="clinicalDetails">Clinical Details</Label>
                  <Textarea id="clinicalDetails" value={editedReferral.clinicalDetails || ''} onChange={handleInputChange} disabled={!isEditMode} rows={4} />
               </div>
               <div className="col-span-2 space-y-1">
                  <Label htmlFor="treatmentToDate">Treatment to Date</Label>
                  <Textarea id="treatmentToDate" value={editedReferral.treatmentToDate || ''} onChange={handleInputChange} disabled={!isEditMode} rows={3} />
               </div>
           </div>

          <Separator />
          
          {/* Add New Note */}
          <div>
            <Label htmlFor="newNote" className="font-medium">Add New Clinical Note</Label>
            <Textarea
              id="newNote"
              placeholder="Add a new note here. This will be appended to the clinical details upon saving."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
          
          <Separator />

          {/* Audit Information */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-muted-foreground">
             <div className="space-y-1">
                <Label>Referred by</Label>
                <p>{referral.referredBy || "N/A"} on {referredOnDate}</p>
             </div>
             <div className="space-y-1">
                <Label>Last Edited by</Label>
                <p>{referral.lastEditedBy || "N/A"} on {lastEditedOnDate}</p>
             </div>
          </div>
        </div>
        <DialogFooter className="pt-4 border-t">
          <div className="flex-grow">
            <Button variant="link" size="sm" asChild>
                <Link href={`/referrals/${referral.id}/history`}>
                    <History className="mr-2 h-4 w-4" />
                    See History
                </Link>
            </Button>
          </div>
           <Button type="button" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaveDisabled}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
