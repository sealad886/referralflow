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
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Patient } from "@/lib/mock-data";

const patientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format."),
  gender: z.enum(["Male", "Female", "Other"]),
  mrn: z.string().min(1, "MRN is required."),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface NewPatientDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPatientCreated: (newPatient: Patient) => void;
}

export function NewPatientDialog({ isOpen, onOpenChange, onPatientCreated }: NewPatientDialogProps) {
  const { toast } = useToast();
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      dob: "",
      gender: "Other",
      mrn: "",
    },
  });

  function onSubmit(data: PatientFormValues) {
    const newPatient: Patient = {
        id: data.mrn, // Using the provided MRN as the ID
        name: data.name,
        dob: data.dob,
        gender: data.gender,
    };
    console.log("Creating new patient:", newPatient);
    toast({
      title: "Patient Created",
      description: `New patient record for ${newPatient.name} has been created.`,
    });
    onPatientCreated(newPatient);
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Patient Record</DialogTitle>
          <DialogDescription>
            Fill in the details for the new patient. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="mrn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MRN (Medical Record Number)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., MRN12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button type="submit">Create Patient</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
