"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (password.length < 6) {
      setErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully. Redirecting to login...");

    await supabase.auth.signOut();

    setTimeout(() => {
      router.push("/login");
      router.refresh();
    }, 1200);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafb] px-6 text-[#263646]">
      <section className="w-full max-w-md rounded-2xl border border-[#e7ecef] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#d8e75c] text-xl font-bold text-[#101d2d]">
            A
          </div>

          <p className="text-xs uppercase tracking-[0.16em] text-[#8b99a5]">
            Axiom Academic Systems
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Choose a new password
          </h1>

          <p className="mt-2 text-sm text-[#8b99a5]">
            Enter and confirm your new account password.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            New password

            <input
              type="password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#dfe6ea] px-3 py-2 text-sm outline-none focus:border-[#b7c857]"
            />
          </label>

          <label className="block text-sm font-medium">
            Confirm new password

            <input
              type="password"
              minLength={6}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-[#dfe6ea] px-3 py-2 text-sm outline-none focus:border-[#b7c857]"
            />
          </label>

          {message && (
            <p className="rounded-lg bg-[#f4f8dc] p-3 text-sm text-[#667c2d]">
              {message}
            </p>
          )}

          {errorMessage && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#101d2d] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>
    </main>
  );
}
