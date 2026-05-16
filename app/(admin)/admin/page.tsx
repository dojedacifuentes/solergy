"use client";
import { useAdminSession } from "@/lib/hooks/useAdminSession";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default function AdminPage() {
  const { isAuthenticated, login, logout } = useAdminSession();
  return isAuthenticated
    ? <AdminPanel onLogout={logout} />
    : <AdminLogin onLogin={login} />;
}
