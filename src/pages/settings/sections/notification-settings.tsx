import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function NotificationSettings() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    orderUpdates: true,
    newProducts: false,
    marketing: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications">Push Notifications</Label>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, push: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates">Order Updates</Label>
            <Switch
              id="order-updates"
              checked={notifications.orderUpdates}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, orderUpdates: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="new-products">New Products</Label>
            <Switch
              id="new-products"
              checked={notifications.newProducts}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, newProducts: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="marketing">Marketing Communications</Label>
            <Switch
              id="marketing"
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, marketing: checked }))
              }
            />
          </div>
        </div>

        <Button onClick={handleSave}>Save Preferences</Button>
      </CardContent>
    </Card>
  );
}