
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { patients, Patient } from "@/lib/mock-data";
import { NewPatientDialog } from "./new-patient-dialog";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { submitReferral } from "@/ai/flows/submit-referral-flow";

const referralFormSchema = z.object({
  patientId: z.string().min(1, "A patient must be selected."),
  department: z.string().min(1, "Please select a department."),
  priority: z.enum(["Routine", "Urgent", "STAT"], {
    required_error: "You need to select a priority level.",
  }),
  diagnosis: z.string().optional(),
  side: z.enum(["Left", "Right", "Both", "General"]).optional(),
  severity: z.enum(["Mild", "Moderate", "Severe"]).optional(),
  notes: z.string().optional(),
});

type ReferralFormValues = z.infer<typeof referralFormSchema>;

export function NewReferralDialog() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = React.useState("");
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = React.useState(false);

  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralFormSchema),
    defaultValues: {
      patientId: "",
      department: "",
      priority: "Routine",
      notes: "",
    },
  });

  const filteredPatients = React.useMemo(() => {
    if (!patientSearchTerm) return [];
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearchTerm.toLowerCase())
    );
  }, [patientSearchTerm]);
  
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue("patientId", patient.id);
    setPatientSearchTerm(""); // Clear search
  };
  
  const handleCreateNewPatient = (newPatient: Patient) => {
    // In a real app, you'd add this to your state/backend.
    // Here, we'll just select them.
    patients.push(newPatient); // Mock adding to data
    handleSelectPatient(newPatient);
    setIsNewPatientDialogOpen(false);
  }

  function onSaveDraft(data: ReferralFormValues) {
    console.log("Saving draft:", data);
    toast({
      title: "Draft Saved",
      description: `Referral draft for ${selectedPatient?.name} has been saved.`,
    });
    setIsOpen(false);
    form.reset();
    setSelectedPatient(null);
  }

  async function onSendReferral(data: ReferralFormValues) {
    if (!selectedPatient) return;
    setIsSubmitting(true);
    
    try {
      const result = await submitReferral({
        patient: selectedPatient,
        department: data.department,
        priority: data.priority,
        notes: data.notes || '',
      });

      toast({
        title: "Referral Submitted Successfully",
        description: result.confirmationMessage,
      });

      console.log("Notification Summary:", result.notificationSummary);

      setIsOpen(false);
      form.reset();
      setSelectedPatient(null);
    } catch (error) {
      console.error("Failed to submit referral:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not submit the referral. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <PlusCircle className="h-4 w-4" />
          New Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Referral</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new patient referral.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                   {selectedPatient ? (
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{selectedPatient.name}</p>
                          <p className="text-sm text-muted-foreground">
                            MRN: {selectedPatient.id} - DOB: {selectedPatient.dob}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPatient(null);
                            form.setValue("patientId", "");
                          }}
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="relative">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input
                           placeholder="Search by name or MRN..."
                           value={patientSearchTerm}
                           onChange={(e) => setPatientSearchTerm(e.target.value)}
                           className="pl-8"
                         />
                         {filteredPatients.length > 0 && patientSearchTerm && (
                           <ScrollArea className="h-[200px] w-full rounded-md border mt-2">
                             <div className="p-2">
                               {filteredPatients.map(p => (
                                 <div key={p.id} onClick={() => handleSelectPatient(p)} className="p-2 rounded-md hover:bg-accent cursor-pointer">
                                   <p className="font-semibold">{p.name}</p>
                                   <p className="text-sm text-muted-foreground">MRN: {p.id} - DOB: {p.dob}</p>
                                 </div>
                               ))}
                             </div>
                           </ScrollArea>
                         )}
                         {filteredPatients.length === 0 && patientSearchTerm && (
                           <div className="text-center p-4 border rounded-md mt-2">
                              <p className="text-sm text-muted-foreground">No patients found.</p>
                              <Button variant="link" size="sm" type="button" onClick={() => setIsNewPatientDialogOpen(true)}>
                                  Create a new patient record?
                              </Button>
                           </div>
                         )}
                      </div>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <fieldset disabled={!selectedPatient} className="space-y-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="Neurology">Neurology</SelectItem>
                        <SelectItem value="Oncology">Oncology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex items-center space-x-4"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Routine" />
                          </FormControl>
                          <FormLabel className="font-normal">Routine</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Urgent" />
                          </FormControl>
                          <FormLabel className="font-normal">Urgent</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="STAT" />
                          </FormControl>
                          <FormLabel className="font-normal">STAT</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Atrial Fibrillation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="side"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Side</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select side" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Left">Left</SelectItem>
                            <SelectItem value="Right">Right</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                            <SelectItem value="General">General</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Mild">Mild</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Severe">Severe</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clinical Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any relevant clinical notes or reasons for referral."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
              <Button type="button" variant="outline" onClick={form.handleSubmit(onSaveDraft)} disabled={!selectedPatient || isSubmitting}>Save Draft</Button>
              <Button type="button" onClick={form.handleSubmit(onSendReferral)} disabled={!form.formState.isValid || isSubmitting}>
                {isSubmitting ? "Submitting..." : "Send Referral"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
     <NewPatientDialog
        isOpen={isNewPatientDialogOpen}
        onOpenChange={setIsNewPatientDialogOpen}
        onPatientCreated={handleCreateNewPatient}
      />
    </>
  );
}
