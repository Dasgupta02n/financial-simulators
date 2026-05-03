import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminLayout } from "@/components/admin/admin-layout";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session?.value) {
    redirect("/admin/login");
  }

  return <AdminLayout />;
}