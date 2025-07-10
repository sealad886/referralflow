
"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Patient, Referral, referrals } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ReferralDetailDialog } from "./referral-detail-dialog";

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
  const [selectedReferral, setSelectedReferral] = React.useState<Referral | null>(null);
  const [isReferralDialogOpen, setIsReferralDialogOpen] = React.useState(false);
  
  const { toast } = useToast();

  const patientReferrals = React.useMemo(() => {
    return referrals
      .filter(r => r.patient.id === patient.id && !r.isDraft)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patient.id]);

  React.useEffect(() => {
    setEditedPatient(patient);
    setIsEditMode(false);
  }, [patient]);
  
  // This effect closes the referral dialog if the main patient dialog closes
  React.useEffect(() => {
    if (!isOpen) {
        setIsReferralDialogOpen(false);
        setSelectedReferral(null);
    }
  }, [isOpen]);

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

  const handleReferralClick = (referral: Referral) => {
    setSelectedReferral(referral);
    setIsReferralDialogOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        } else {
          onOpenChange(true);
        }
      }}>
        <DialogContent className="sm:max-w-3xl">
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
          <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-4">
             {/* Demographics Section */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div className="space-y-1">
                <Label htmlFor="id">Patient ID (MRN)</Label>
                <Input id="id" value={editedPatient.id} disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={editedPatient.name} onChange={handleInputChange} disabled={!isEditMode} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="dob">Date of Birth</Label>
                 <Popover>
                  <PopoverTrigger asChild disabled={!isEditMode}>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
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
               <div className="space-y-1">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" value={editedPatient.gender} onChange={handleInputChange} disabled={!isEditMode} />
               </div>
            </div>
            
            <Separator />
            
            {/* Referrals Section */}
            <div>
              <h4 className="text-lg font-medium mb-2">Referral History</h4>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Diagnosis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patientReferrals.length > 0 ? (
                        patientReferrals.map((referral) => (
                          <TableRow key={referral.id} onClick={() => handleReferralClick(referral)} className="cursor-pointer">
                            <TableCell>{referral.date}</TableCell>
                            <TableCell>{referral.department}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{referral.status}</Badge>
                            </TableCell>
                            <TableCell>{referral.diagnosis || "N/A"}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground">
                            No referrals found for this patient.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t">
             <div className="flex-grow">
                <Button variant="link" size="sm" asChild>
                    <Link href={`/patients/${patient.id}/history`}>
                        <History className="mr-2 h-4 w-4" />
                        See History
                    </Link>
                </Button>
            </div>
            <Button type="button" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={!isEditMode}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Nested Referral Dialog */}
      {selectedReferral && (
        <ReferralDetailDialog
          referral={selectedReferral}
          isOpen={isReferralDialogOpen}
          onOpenChange={setIsReferralDialogOpen}
        />
      )}
    </>
  );
}
