
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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  UserRole,
  UserStatus,
  UserPermission,
  userGroups,
  users,
} from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import {
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldAlert,
  Trash2,
  Users as UsersIcon,
} from "lucide-react";

interface UserDetailDialogProps {
  user: User | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDialogClose: (refresh?: boolean) => void;
}

const allPermissions: { id: UserPermission; label: string; description: string }[] = [
  { id: "CanAssignReferral", label: "Assign Referrals", description: "User can assign a referral to another user." },
  { id: "CanCompleteReferral", label: "Complete Referrals", description: "User can mark a referral as completed."},
  { id: "CanRefuseReferral", label: "Refuse Referrals", description: "User can refuse a referral assigned to them."},
  { id: "CanEditUsers", label: "Edit Users", description: "User can edit other user profiles and permissions."},
  { id: "CanViewGroupAnalytics", label: "View Group Analytics", description: "User can view analytics for their groups."},
  { id: "CanViewSystemAnalytics", label: "View System Analytics", description: "User can view system-wide analytics."},
];

export function UserDetailDialog({
  user,
  isOpen,
  onOpenChange,
  onDialogClose,
}: UserDetailDialogProps) {
  const [editedUser, setEditedUser] = React.useState<Partial<User>>(user || {});
  const { toast } = useToast();
  
  const isNewUser = !user;

  React.useEffect(() => {
    setEditedUser(user || {});
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof User, value: string) => {
    setEditedUser((prev) => ({ ...prev, [id]: value }));
  };
  
  const handlePermissionChange = (permission: UserPermission, value: boolean) => {
    setEditedUser(prev => ({
        ...prev,
        permissions: {
            ...prev.permissions,
            [permission]: value,
        }
    }));
  }

  const handleSave = () => {
    // In a real app, this would be an API call
    console.log("Saving user:", editedUser);
    toast({
      title: isNewUser ? "User Created" : "User Updated",
      description: `User record for ${editedUser.firstName} ${editedUser.lastName} has been saved.`,
    });
    onDialogClose(true); // Close and indicate a refresh is needed
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isNewUser ? "Add New User" : "Edit User Profile"}</DialogTitle>
          <DialogDescription>
            {isNewUser ? "Fill in the details to onboard a new user." : `Manage profile, permissions, and groups for ${user?.firstName} ${user?.lastName}.`}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] p-1">
        <div className="grid gap-8 py-4 pr-6">
          
          {/* Personal Information */}
          <section>
            <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={editedUser.title || ''} onChange={handleInputChange} />
              </div>
               <div className="space-y-1">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={editedUser.firstName || ''} onChange={handleInputChange} />
              </div>
               <div className="space-y-1">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={editedUser.lastName || ''} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <Separator />
          
          {/* Account Information */}
           <section>
            <h3 className="font-semibold text-lg mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="space-y-1">
                  <Label htmlFor="role">Role</Label>
                  <Select value={editedUser.role} onValueChange={(val) => handleSelectChange('role', val)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Clerical">Clerical</SelectItem>
                        <SelectItem value="Clinical">Clinical</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div className="space-y-1">
                  <Label htmlFor="status">Status</Label>
                  <Select value={editedUser.status} onValueChange={(val) => handleSelectChange('status', val)}>
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
               <div className="space-y-1">
                  <Label htmlFor="departments">Departments</Label>
                  <Input id="departments" value={editedUser.departments?.join(', ') || ''} onChange={(e) => setEditedUser(prev => ({...prev, departments: e.target.value.split(', ')}))} placeholder="e.g., Cardiology, Neurology"/>
              </div>
              <div className="md:col-span-3 space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center gap-2">
                    <Input id="email" type="email" value={editedUser.email || ''} onChange={handleInputChange} />
                    {editedUser.emailVerified ? (
                        <Badge variant="default" className="gap-1.5 whitespace-nowrap"><CheckCircle2 className="h-3 w-3"/> Verified</Badge>
                    ) : (
                        <Button variant="outline" size="sm" className="whitespace-nowrap">
                            <Mail className="mr-2 h-4 w-4"/>
                            Send Verification
                        </Button>
                    )}
                  </div>
              </div>
               <div className="md:col-span-3 space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Input id="phone" type="tel" value={editedUser.phone || ''} onChange={handleInputChange} />
                    {editedUser.phoneVerified ? (
                        <Badge variant="default" className="gap-1.5 whitespace-nowrap"><CheckCircle2 className="h-3 w-3"/> Verified</Badge>
                    ) : (
                        <Button variant="outline" size="sm" className="whitespace-nowrap">Send Verification</Button>
                    )}
                  </div>
              </div>
            </div>
          </section>

          <Separator />
          
           {/* Security */}
           <section>
                <h3 className="font-semibold text-lg mb-4">Security & Permissions</h3>
                <div className="space-y-6">
                    {/* MFA */}
                    <div className="flex items-start gap-4">
                        <KeyRound className="h-6 w-6 mt-1 text-muted-foreground"/>
                        <div className="flex-1">
                            <h4 className="font-medium">Multi-Factor Authentication</h4>
                            <div className="flex items-center justify-between p-3 border rounded-md mt-2">
                                <p className="text-sm">Authenticator App Status</p>
                                {editedUser.mfaEnabled ? (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="default">Enabled</Badge>
                                        <Button variant="outline" size="sm" className="text-destructive">Revoke</Button>
                                    </div>
                                ) : (
                                    <Badge variant="secondary">Disabled</Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Groups */}
                     <div className="flex items-start gap-4">
                        <UsersIcon className="h-6 w-6 mt-1 text-muted-foreground"/>
                        <div className="flex-1">
                            <h4 className="font-medium">User Groups</h4>
                             <div className="p-3 border rounded-md mt-2 space-y-2">
                                {userGroups.map(group => (
                                    <div key={group.id} className="flex items-center">
                                        <Checkbox
                                            id={`group-${group.id}`}
                                            checked={editedUser.groups?.includes(group.id)}
                                            onCheckedChange={(checked) => {
                                                const currentGroups = editedUser.groups || [];
                                                const newGroups = checked ? [...currentGroups, group.id] : currentGroups.filter(g => g !== group.id);
                                                setEditedUser(p => ({...p, groups: newGroups}));
                                            }}
                                        />
                                        <Label htmlFor={`group-${group.id}`} className="ml-2 font-normal">{group.name}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Permissions */}
                     <div className="flex items-start gap-4">
                        <ShieldAlert className="h-6 w-6 mt-1 text-muted-foreground"/>
                        <div className="flex-1">
                            <h4 className="font-medium">Permission Overrides</h4>
                            <p className="text-sm text-muted-foreground">User-specific permissions override group settings.</p>
                             <div className="p-3 border rounded-md mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {allPermissions.map(perm => (
                                    <div key={perm.id} className="flex items-start">
                                        <Checkbox 
                                            id={perm.id}
                                            checked={editedUser.permissions?.[perm.id] || false}
                                            onCheckedChange={(checked) => handlePermissionChange(perm.id, !!checked)}
                                        />
                                        <div className="grid gap-1.5 leading-none ml-2">
                                            <Label htmlFor={perm.id} className="font-normal">{perm.label}</Label>
                                            <p className="text-xs text-muted-foreground">{perm.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t">
          {!isNewUser && (
             <Button type="button" variant="destructive" className="mr-auto" onClick={() => {
                toast({ variant: 'destructive', title: 'User Deactivated', description: `${user.firstName} ${user.lastName} has been deactivated.`});
                onDialogClose(true);
             }}>
                <Trash2 className="mr-2 h-4 w-4"/>
                Deactivate User
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={() => onDialogClose()}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {isNewUser ? "Create User" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
