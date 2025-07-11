
"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  MoreHorizontal,
  PlusCircle,
  Search,
  Users as UsersIcon,
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
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
  users,
  User,
  UserStatus,
  UserRole,
} from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDetailDialog } from "@/components/user-detail-dialog";

const statusColors: { [key in UserStatus]: "default" | "secondary" | "destructive" } = {
  Active: "default",
  Inactive: "destructive",
  Pending: "secondary",
};

const allRoles: UserRole[] = ["Admin", "Manager", "Clinical", "Clerical"];
const allStatuses: UserStatus[] = ["Active", "Inactive", "Pending"];

type SortKey = "name" | "status" | "role" | "department";


export default function UsersPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = React.useState(false);

  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = React.useState<{ role: UserRole[], status: UserStatus[] }>({ role: [], status: [] });

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handleFilterChange = (filterType: 'role' | 'status', value: string) => {
    setFilters(prev => {
      const currentValues = prev[filterType];
      const newValues = currentValues.includes(value as any)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterType]: newValues as any };
    });
  };

  const filteredData = React.useMemo(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(lowercasedTerm) ||
        user.email.toLowerCase().includes(lowercasedTerm)
      );
    }
    
    if (filters.role.length > 0) {
      filtered = filtered.filter(u => filters.role.includes(u.role));
    }
    
    if (filters.status.length > 0) {
      filtered = filtered.filter(u => filters.status.includes(u.status));
    }

    return filtered;
  }, [searchTerm, filters]);
  
  const sortedAndFilteredData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === 'name') {
            aValue = `${a.firstName} ${a.lastName}`;
            bValue = `${b.firstName} ${b.lastName}`;
        } else if (sortConfig.key === 'department') {
            aValue = a.departments.join(', ');
            bValue = b.departments.join(', ');
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setIsUserDetailOpen(true);
  };
  
  const handleOpenNewUserDialog = () => {
    setSelectedUser(null);
    setIsUserDetailOpen(true);
  }

  const handleDialogClose = (refresh?: boolean) => {
    setIsUserDetailOpen(false);
    setSelectedUser(null);
    // if (refresh) { ... refresh data logic ... }
  };

  return (
    <AppLayout>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-3xl">User Management</h1>
          <div className="flex gap-2">
            <Button variant="outline">
                <UsersIcon className="mr-2 h-4 w-4"/>
                Manage Groups
            </Button>
            <Button onClick={handleOpenNewUserDialog}>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add User
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Onboard, offboard, and manage permissions for all users.
            </CardDescription>
            <div className="flex items-center justify-between mt-2">
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
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
                    <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allRoles.map(role => (
                        <DropdownMenuCheckboxItem
                            key={role}
                            checked={filters.role.includes(role)}
                            onCheckedChange={() => handleFilterChange('role', role)}
                        >
                        {role}
                        </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allStatuses.map(status => (
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
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('name')} className="px-0">
                      Name
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('status')} className="px-0">
                      Status
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('role')} className="px-0">
                      Role
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                   <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('department')} className="px-0">
                      Department
                      <ChevronsUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredData.map((user) => (
                  <TableRow 
                    key={user.id} 
                    onClick={() => handleRowClick(user)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://placehold.co/100x100.png?text=${user.firstName[0]}${user.lastName[0]}`} />
                          <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{user.title} {user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[user.status]}>{user.status}</Badge>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.departments.join(', ')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleRowClick(user)}>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Deactivate User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <UserDetailDialog 
            user={selectedUser}
            isOpen={isUserDetailOpen}
            onOpenChange={setIsUserDetailOpen}
            onDialogClose={handleDialogClose}
        />
      </main>
    </AppLayout>
  );
}
