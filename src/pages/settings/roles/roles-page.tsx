import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RoleForm } from "./role-form";
import { RoleTable } from "./role-table";
import { Permission, RoleConfig } from "@/lib/types/role";
import { useRolesStore } from "@/lib/store/roles.store";
import { ProtectedElement } from "@/components/ui/protected-element";
import { useToast } from "@/hooks/use-toast";

const availablePermissions: Permission[] = [
  "dashboard.view",
  "products.view",
  "products.create",
  "products.edit",
  "products.delete",
  "orders.view",
  "orders.update",
  "orders.cancel",
  "vendors.view",
  "vendors.create",
  "vendors.edit",
  "vendors.delete",
  "users.view",
  "users.create",
  "users.edit",
  "users.delete",
  "reports.view",
  "reports.export",
  "settings.view",
  "settings.edit",
];

export function RolesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(null);
  const { roles, addRole, updateRole, deleteRole } = useRolesStore();
  const { toast } = useToast();

  const handleCreateRole = (data: RoleConfig) => {
    try {
      // Check if role already exists
      if (roles[data.name]) {
        toast({
          title: "Error",
          description: "A role with this name already exists.",
          variant: "destructive",
        });
        return;
      }

      addRole(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Role created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateRole = (name: string, data: Partial<RoleConfig>) => {
    try {
      updateRole(name, data);
      setIsEditDialogOpen(false);
      setSelectedRole(null);
      toast({
        title: "Success",
        description: "Role updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;

    try {
      deleteRole(selectedRole.name);
      setIsDeleteDialogOpen(false);
      setSelectedRole(null);
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">
            Manage roles and their permissions
          </p>
        </div>

        <ProtectedElement permissions={["users.create"]}>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Role
          </Button>
        </ProtectedElement>
      </div>

      <RoleTable
        roles={Object.values(roles)}
        onEdit={(role) => {
          setSelectedRole(role);
          setIsEditDialogOpen(true);
        }}
        onDelete={(role) => {
          setSelectedRole(role);
          setIsDeleteDialogOpen(true);
        }}
      />

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Role</DialogTitle>
          </DialogHeader>
          <RoleForm
            // onSubmit={handleCreateRole}
            onSubmit={(data) => handleCreateRole(data as RoleConfig)}
            availablePermissions={availablePermissions}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <RoleForm
              initialData={selectedRole}
              // onSubmit={(data) => handleUpdateRole(selectedRole.name, data)}
              onSubmit={(data) =>
                handleUpdateRole(
                  selectedRole!.name,
                  data as Partial<RoleConfig>
                )
              }
              availablePermissions={availablePermissions}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Role Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the role "{selectedRole?.name}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRole(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteRole}
              className="bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
