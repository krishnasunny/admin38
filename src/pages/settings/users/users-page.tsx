import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateUserDialog } from "./create-user-dialog";
import { EditUserDialog } from "./edit-user-dialog";
import { DeleteUserDialog } from "./delete-user-dialog";
import { UsersTable } from "./users-table";
import { User } from "./users-types";
import { useToast } from "@/hooks/use-toast";
import { url } from "@/lib/utils";

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${url.api}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

  
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log(data.items);
      setUsers(data.items);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage system users</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <UsersTable
        users={users||[]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "User created successfully",
          });
          fetchUsers();
        }}
      />

      {selectedUser && (
        <>
          <EditUserDialog
            user={selectedUser}
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) setSelectedUser(null);
            }}
            onSuccess={() => {
              toast({
                title: "Success",
                description: "User updated successfully",
              });
              fetchUsers();
            }}
          />

          <DeleteUserDialog
            user={selectedUser}
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              setIsDeleteDialogOpen(open);
              if (!open) setSelectedUser(null);
            }}
            onSuccess={() => {
              toast({
                title: "Success",
                description: "User deleted successfully",
              });
              fetchUsers();
            }}
          />
        </>
      )}
    </div>
  );
}