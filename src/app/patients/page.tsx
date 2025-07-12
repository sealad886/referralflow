
"use client";

import * as React from "react";
import { AppLayout } from "@/components/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { patients, Patient } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { PatientDetailDialog } from "@/components/patient-detail-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PatientsPage() {
  const [filteredPatients, setFilteredPatients] = React.useState(patients);
  const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setFilteredPatients(
      patients.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.id.toLowerCase().includes(term)
      )
    );
  };

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-semibold text-3xl">Patient Records</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Search Patients</CardTitle>
            <CardDescription>
              Find patients by name or ID to view their demographic
              information.
            </CardDescription>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patient name or ID..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                onChange={handleSearch}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient: Patient) => (
                  <TableRow 
                    key={patient.id} 
                    onClick={() => handleRowClick(patient)} 
                    className="cursor-pointer"
                  >
                    <TableCell className="font-mono text-sm">{patient.id}</TableCell>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.dob}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {selectedPatient && (
          <PatientDetailDialog
            patient={selectedPatient}
            isOpen={!!selectedPatient}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setSelectedPatient(null);
              }
            }}
          />
        )}
      </main>
    </AppLayout>
  );
}
