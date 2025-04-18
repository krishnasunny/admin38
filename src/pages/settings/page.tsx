import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSettings } from "./sections/theme-settings";
import { ProfileSettings } from "./sections/profile-settings";
import { NotificationSettings } from "./sections/notification-settings";
import { RolesPage } from "./roles/roles-page";
import { UsersPage } from "./users/users-page";
import { useAuthStore } from "@/lib/store";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          {/* <TabsTrigger value="roles">Roles</TabsTrigger> */}
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <ThemeSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>

        {/* <TabsContent value="roles" className="space-y-4">
          <RolesPage />
        </TabsContent> */}
        {user?.role=="super_admin"?(
        <TabsContent value="users" className="space-y-4">
          <UsersPage />
        </TabsContent>):(<TabsContent value="users" className="space-y-4">
         <h3>No Permission</h3>
        </TabsContent>)}
      </Tabs>
    </div>
  );
}