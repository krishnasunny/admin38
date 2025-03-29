import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Permission, RoleConfig } from "@/lib/types/role";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(10),
  permissions: z.array(z.string()),
});

interface RoleFormProps {
  initialData?: RoleConfig;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  availablePermissions: Permission[];
}

export function RoleForm({ initialData, onSubmit, availablePermissions }: RoleFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      permissions: [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={!!initialData} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Permissions</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {availablePermissions.map((permission) => (
              <FormField
                key={permission}
                control={form.control}
                name="permissions"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(permission)}
                        onCheckedChange={(checked) => {
                          const newValue = checked
                            ? [...field.value, permission]
                            : field.value?.filter((p) => p !== permission);
                          field.onChange(newValue);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {permission}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <Button type="submit">
          {initialData ? "Update Role" : "Create Role"}
        </Button>
      </form>
    </Form>
  );
}