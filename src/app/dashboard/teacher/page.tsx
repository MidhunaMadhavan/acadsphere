import { Suspense } from "react";
import TeacherContent from "./TeacherContent";

function TeacherLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafb] text-[#263646]">
      <p className="text-sm text-[#8b99a5]">
        Checking teacher permissions...
      </p>
    </main>
  );
}

export default function TeacherPage() {
  return (
    <Suspense fallback={<TeacherLoading />}>
      <TeacherContent />
    </Suspense>
  );
}
