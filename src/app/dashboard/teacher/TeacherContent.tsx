import { connection } from "next/server";
import { requireRole } from "@/lib/auth/roles";

export default async function TeacherContent() {
  await connection();

  const user = await requireRole(["teacher", "hod", "admin"]);

  return (
    <main className="min-h-screen bg-[#f8fafb] px-6 py-12 text-[#263646]">
      <section className="mx-auto max-w-3xl rounded-2xl border border-[#e7ecef] bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.16em] text-[#8b99a5]">
          Teacher workspace
        </p>

        <h1 className="mt-3 text-3xl font-semibold">
          Teacher access confirmed
        </h1>

        <p className="mt-3 text-sm text-[#8b99a5]">
          Signed in as {user.email}
        </p>

        <p className="mt-6 rounded-lg bg-[#f4f8dc] p-4 text-sm text-[#667c2d]">
          Your role is authorized to manage subjects, syllabus documents, and
          exam configurations.
        </p>
      </section>
    </main>
  );
}
