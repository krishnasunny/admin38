import { RoleConfig } from "@/lib/types/role";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ProtectedElement } from "@/components/ui/protected-element";

interface RoleTableProps {
  roles: RoleConfig[];
  onEdit: (role: RoleConfig) => void;
  onDelete: (role: RoleConfig) => void;
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Permissions</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.name}>
              <TableCell className="font-medium">{role.name}</TableCell>
              <TableCell>{role.description}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ProtectedElement permissions={['users.edit']}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(role)}
                    >
                      Edit
                    </Button>
                  </ProtectedElement>
                  
                  <ProtectedElement permissions={['users.delete']}>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(role)}
                    >
                      Delete
                    </Button>
                  </ProtectedElement>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}