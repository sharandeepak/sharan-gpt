import { AdminDashboard } from "@/components/AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-bg text-fg p-8 md:p-12">
      <AdminDashboard />
    </main>
  );
}
