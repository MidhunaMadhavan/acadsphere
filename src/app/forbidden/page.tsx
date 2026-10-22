import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafb] px-6 text-center text-[#263646]">
      <section className="max-w-md rounded-2xl border border-[#e7ecef] bg-white p-8 shadow-sm">
        <div className="text-4xl">403</div>

        <h1 className="mt-4 text-2xl font-semibold">
          Access not permitted
        </h1>

        <p className="mt-3 text-sm text-[#8b99a5]">
          Your account does not have permission to open this workspace.
        </p>

        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-lg bg-[#101d2d] px-4 py-3 text-sm font-semibold text-white"
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
