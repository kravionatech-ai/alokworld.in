import AdminDashboard from "../page";
import { ADMIN_STATIC_PATHS } from "@/lib/adminNavigation";

export function generateStaticParams() {
  return ADMIN_STATIC_PATHS.map((tab) => ({ tab }));
}

export default function AdminTabPage() {
  return <AdminDashboard />;
}
