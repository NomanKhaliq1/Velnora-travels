import { requireAdmin } from "@/lib/auth/session";
import { listSubmissions } from "@/lib/submissions";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const unread = (await listSubmissions()).filter((s) => !s.read).length;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <AdminSidebar email={session.email} unread={unread} />
      <main className="p-4 sm:p-8 lg:p-10 min-w-0">{children}</main>
    </div>
  );
}
