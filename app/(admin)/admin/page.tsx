"use client";
import { useAdminSession } from "@/lib/hooks/useAdminSession";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminPanel } from "@/components/admin/AdminPanel";

export default function AdminPage() {
  const { isAuthenticated } = useAdminSession();
  return isAuthenticated ? <AdminPanel /> : <AdminLogin />;
}
