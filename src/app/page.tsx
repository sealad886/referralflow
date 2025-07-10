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
import { referrals, Referral, Patient } from "@/lib/mock-data";
import { NewReferralDialog } from "@/components/new-referral-dialog";
import { Checkbox } from "@/components/ui/checkbox";

const statusColors: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "Pending": "secondary",
  "In Progress": "default",
  "Completed": "outline",
  "Cancelled": "destructive",
};

type SortKey = "patient" | "department" | "status" | "date";

export default function DashboardPage() {
  const [data, setData] = React.useState(referrals);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({ key: 'date', direction: 'desc' });
  const [filters, setFilters] = React.useState<{ department: string[], status: string[] }>({ department: [], status: [] });
  const [searchTerm, setSearchTerm] = React.useState("");

  const departments = React.useMemo(() => [...new Set(referrals.map(r => r.department))], []);
  const statuses = React.useMemo(() => [...new Set(referrals.map(r => r.status))], []);

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
      setSelectedRows(data.map(r => r.id));
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

  const filteredData = React.useMemo(() => {
    let filtered = [...referrals];

    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filters.department.length > 0) {
      filtered = filtered.filter(r => filters.department.includes(r.department));
    }
    
    if (filters.status.length > 0) {
      filtered = filtered.filter(r => filters.status.includes(r.status));
    }

    return filtered;
  }, [searchTerm, filters]);


  const sortedAndFilteredData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'patient') {
            const aPatient = a.patient as Patient;
            const bPatient = b.patient as Patient;
            if (aPatient.name < bPatient.name) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aPatient.name > bPatient.name) return sortConfig.direction === 'asc' ? 1 : -1;
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

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-3xl">Referral Dashboard</h1>
          <NewReferralDialog />
        </div>
        <Tabs defaultValue="all">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setFilters(prev => ({ ...prev, status: [] }))}>All</TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setFilters(prev => ({...prev, status: ['Pending']}))}>Pending</TabsTrigger>
              <TabsTrigger value="in-progress" onClick={() => setFilters(prev => ({...prev, status: ['In Progress']}))}>In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="hidden sm:flex" onClick={() => setFilters(prev => ({...prev, status: ['Completed']}))}>
                Completed
              </TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
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
                  {statuses.map(status => (
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
          <TabsContent value="all">
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
                      <TableHead padding="checkbox">
                        <Checkbox
                          checked={numSelected === sortedAndFilteredData.length && sortedAndFilteredData.length > 0 ? true : numSelected > 0 ? 'indeterminate' : false}
                          onCheckedChange={handleSelectAll}
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
                        <TableRow key={referral.id} data-state={isSelected && "selected"}>
                          <TableCell padding="checkbox">
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
                          <TableCell>
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
                                <DropdownMenuItem>View Details</DropdownMenuItem>
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
      </main>
    </AppLayout>
  );
}
