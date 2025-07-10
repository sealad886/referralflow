
"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  FileDown,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";

import { AppLayout } from "@/components/app-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { referrals, Referral, Patient, ReferralStatus } from "@/lib/mock-data";
import { NewReferralDialog } from "@/components/new-referral-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ReferralDetailDialog } from "@/components/referral-detail-dialog";

const statusColors: { [key in ReferralStatus]: "default" | "secondary" | "destructive" | "outline" } = {
  "Pending": "secondary",
  "In Progress": "default",
  "Completed": "outline",
  "Cancelled": "destructive",
  "Canceled by referrer": "destructive",
  "Refused by referred": "destructive",
  "Patient declined": "destructive",
  "Draft": "secondary",
};

const doneStatuses: ReferralStatus[] = ["Completed", "Cancelled", "Canceled by referrer", "Refused by referred", "Patient declined"];

type SortKey = "patient" | "department" | "status" | "date";

export default function ReferralsPage() {
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = React.useState<{ department: string[], status: string[] }>({ department: [], status: [] });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeTab, setActiveTab] = React.useState('all');
  const [includeDone, setIncludeDone] = React.useState(false);
  const [selectedReferral, setSelectedReferral] = React.useState<Referral | null>(null);

  const departments = React.useMemo(() => [...new Set(referrals.map(r => r.department))], []);
  
  const availableStatuses = React.useMemo(() => {
    const allStatuses: ReferralStatus[] = ["Draft", "Pending", "In Progress", "Completed", "Cancelled", "Canceled by referrer", "Refused by referred", "Patient declined"];
    if (includeDone) {
      return allStatuses;
    }
    return allStatuses.filter(s => !doneStatuses.includes(s));
  }, [includeDone]);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterType: 'department' | 'status', value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues };
    });
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedRows(sortedAndFilteredData.map(r => r.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => 
      prev.includes(rowId) 
        ? prev.filter(id => id !== rowId) 
        : [...prev, rowId]
    );
  };

  const handleRowClick = (referral: Referral) => {
    if (referral.isDraft) {
      // Logic to open and edit draft - can be a special prop to NewReferralDialog
      console.log("Editing draft:", referral.id);
    } else {
      setSelectedReferral(referral);
    }
  };
  
  React.useEffect(() => {
    // When includeDone changes, we might need to update the status filter
    // to remove statuses that are no longer available.
    if (!includeDone) {
        setFilters(prev => ({
            ...prev,
            status: prev.status.filter(s => !doneStatuses.includes(s as ReferralStatus))
        }));
    }
  }, [includeDone]);

  const filteredByDoneStatus = React.useMemo(() => {
    if (includeDone) {
        return [...referrals];
    }
    return referrals.filter(r => !doneStatuses.includes(r.status));
  }, [includeDone]);

  const filteredData = React.useMemo(() => {
    let filtered = [...filteredByDoneStatus];

    // Tab-based filtering
    if (activeTab === 'pending') {
        filtered = filtered.filter(r => r.status === 'Pending');
    } else if (activeTab === 'in-progress') {
        filtered = filtered.filter(r => r.status === 'In Progress');
    } else if (activeTab === 'drafts') {
        filtered = filtered.filter(r => r.status === 'Draft');
    }

    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.patient.name.toLowerCase().includes(lowercasedTerm) ||
        r.patient.id.toLowerCase().includes(lowercasedTerm) ||
        r.department.toLowerCase().includes(lowercasedTerm) ||
        r.id.toLowerCase().includes(lowercasedTerm) ||
        JSON.stringify(r).toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (filters.department.length > 0) {
      filtered = filtered.filter(r => filters.department.includes(r.department));
    }
    
    if (filters.status.length > 0) {
      filtered = filtered.filter(r => filters.status.includes(r.status));
    }

    return filtered;
  }, [searchTerm, filters, activeTab, filteredByDoneStatus]);


  const sortedAndFilteredData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'patient') {
            const aPatient = a.patient as Patient;
            const bPatient = b.patient as Patient;
            if (aPatient.name.toLowerCase() < bPatient.name.toLowerCase()) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aPatient.name.toLowerCase() > bPatient.name.toLowerCase()) return sortConfig.direction === 'asc' ? 1 : -1;
            if (aPatient.id < bPatient.id) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aPatient.id > bPatient.id) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const numSelected = selectedRows.length;
  
  const getTabCount = (status?: ReferralStatus) => {
    const sourceData = includeDone ? referrals : referrals.filter(r => !doneStatuses.includes(r.status));
    if (!status) return sourceData.length;
    return sourceData.filter(r => r.status === status).length;
  }
  
  const getDraftCount = () => {
    return referrals.filter(r => r.isDraft).length;
  }

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-3xl">Referrals</h1>
          <NewReferralDialog />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="all">All ({getTabCount()})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({getDraftCount()})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({getTabCount('Pending')})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({getTabCount('In Progress')})</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox id="include-done" checked={includeDone} onCheckedChange={(checked) => setIncludeDone(checked as boolean)} />
                    <Label htmlFor="include-done" className="text-sm font-medium">
                        Include Done?
                    </Label>
                </div>
              <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ChevronsUpDown className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filter
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Department</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {departments.map(dept => (
                     <DropdownMenuCheckboxItem
                        key={dept}
                        checked={filters.department.includes(dept)}
                        onCheckedChange={() => handleFilterChange('department', dept)}
                     >
                       {dept}
                     </DropdownMenuCheckboxItem>
                  ))}
                   <DropdownMenuSeparator />
                   <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {availableStatuses.map(status => (
                     <DropdownMenuCheckboxItem
                        key={status}
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => handleFilterChange('status', status)}
                     >
                       {status}
                     </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <FileDown className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </Button>
              </div>
            </div>
          </div>
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Referrals</CardTitle>
                <CardDescription>
                  Track and manage all patient referrals.
                </CardDescription>
                <div className="flex justify-between items-center mt-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="Search referrals..." 
                      className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                   {numSelected > 0 && (
                    <div className="flex items-center gap-2">
                       <span className="text-sm text-muted-foreground">{numSelected} selected</span>
                       <Button variant="outline" size="sm">Update Status</Button>
                       <Button variant="destructive" size="sm" className="gap-1">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                       </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <Checkbox
                          checked={numSelected === sortedAndFilteredData.length && sortedAndFilteredData.length > 0 ? true : numSelected > 0 ? 'indeterminate' : false}
                          onCheckedChange={(checked) => handleSelectAll(checked)}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('patient')} className="p-0 h-6">
                          Patient
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('department')} className="p-0 h-6">
                           Department
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('status')} className="p-0 h-6">
                          Status
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button variant="ghost" size="sm" onClick={() => handleSort('date')} className="p-0 h-6">
                          Date
                          <ChevronsUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredData.map((referral: Referral) => {
                      const isSelected = selectedRows.includes(referral.id);
                      return (
                        <TableRow 
                            key={referral.id} 
                            data-state={isSelected ? "selected" : undefined}
                            onClick={() => handleRowClick(referral)}
                            className="cursor-pointer"
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleRowSelect(referral.id)}
                              aria-label={`Select referral ${referral.id}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div>{referral.patient.name}</div>
                            <div className="text-sm text-muted-foreground">{referral.patient.id}</div>
                          </TableCell>
                          <TableCell>{referral.department}</TableCell>
                          <TableCell>
                            <Badge variant={statusColors[referral.status]}>
                              {referral.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{referral.date}</TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleRowClick(referral)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Update Status</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  Cancel Referral
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {selectedReferral && (
          <ReferralDetailDialog
            referral={selectedReferral}
            isOpen={!!selectedReferral}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setSelectedReferral(null);
              }
            }}
          />
        )}
      </main>
    </AppLayout>
  );
}
