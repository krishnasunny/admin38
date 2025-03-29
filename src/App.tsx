import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout/layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { LoginPage } from "@/pages/login";
import { DashboardPage } from "@/pages/dashboard";
import { UnauthorizedPage } from "@/pages/unauthorized";
import VendorsPage from "./pages/vendors/page";
import { ProductsPage } from "./pages/products";
import { OrdersPage } from "./pages/orders";
import VendorDetailsPage from "./pages/vendors/[id]";
import { RolesPage } from "./pages/settings/roles/roles-page";
import { Toaster } from "@/components/ui/toaster";
import SettingsPage from "./pages/settings/page";
import { VendorDashboardPage } from "./pages/vendor-dashboard";
import { useAuthStore } from "./lib/store";
import CategoriesPage from "./pages/categories/page";

export default function App() {
  const { user } = useAuthStore();
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* <Route path="/" element={<DashboardPage />} /> */}

            <Route
              path="/"
              element={
                user?.role.includes("super_admin") ? (
                  <ProtectedRoute permissions={["dashboard.view"]}>
                    <DashboardPage />
                  </ProtectedRoute>
                ) : (
                  <ProtectedRoute permissions={["vendors-dash.view"]}>
                    <VendorDashboardPage />
                  </ProtectedRoute>
                )
              }
            />

            <Route
              path="/vendors"
              element={
                <ProtectedRoute permissions={["vendors.view"]}>
                  <VendorsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/vendors/:id"
              element={
                <ProtectedRoute permissions={["vendors.view"]}>
                  <VendorDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute permissions={["products.view"]}>
                  <ProductsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute permissions={["orders.view"]}>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />

            {/* Settings Routes */}
            <Route
              path="/settings/roles"
              element={
                <ProtectedRoute permissions={["settings.view"]}>
                  <RolesPage />
                </ProtectedRoute>
              }
            />

            {/* <Route 
              path="/settings/audit" 
              element={
                <ProtectedRoute permissions={['settings.view']}>
                  <AuditPage />
                </ProtectedRoute>
              } 
            /> */}
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute permissions={["settings.view"]}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/categories" element={<CategoriesPage />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}
