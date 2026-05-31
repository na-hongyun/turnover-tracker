import { redirect } from "next/navigation";
import { Dashboard } from "@/presentation/components/Dashboard";
import { getServerSession } from "@/lib/session";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return <Dashboard username={session.username} />;
}
