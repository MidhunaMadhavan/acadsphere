import { Suspense } from "react";
import DashboardContent from "./DashboardContent";

function DashboardLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafb] text-[#263646]">
      <p className="text-sm text-[#8b99a5]">Loading your dashboard...</p>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}
