import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { checkPermissions } from '@/lib/rbac/permissions';
import { Permission } from '@/lib/types/role';

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  permissions: Permission[];
}

const menuItems: MenuItem[] = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    path: '/',
    permissions: ['dashboard.view', 'vendors-dash.view'] // Either permission allows access
  },
  { 
    icon: Users, 
    label: 'Vendors', 
    path: '/vendors',
    permissions: ['vendors.view']
  },
  { 
    icon: Package, 
    label: 'Categories', 
    path: '/categories',
    permissions: ['products.view']
  },
  { 
    icon: Package, 
    label: 'Products', 
    path: '/products',
    permissions: ['products.view']
  },
  { 
    icon: ShoppingCart, 
    label: 'Orders', 
    path: '/orders',
    permissions: ['orders.view']
  },
  { 
    icon: Settings, 
    label: 'Settings', 
    path: '/settings',
    permissions: ['settings.view']
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const user = useAuthStore((state) => state.user);

  // Filter menu items based on user permissions
  const authorizedMenuItems = menuItems.filter(item => {
    if (!user) return false;
    return item.permissions.some(permission => checkPermissions(user.role, [permission]));
  });

  return (
    <aside
      className={cn(
        'h-screen sticky top-0 bg-background border-r transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        <div className="h-14 flex items-center justify-between px-4 border-b">
          {!collapsed && (
            <span className="font-semibold text-lg">Admin Panel</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {authorizedMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground',
                  collapsed && 'justify-center'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}