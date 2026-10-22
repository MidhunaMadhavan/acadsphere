"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage(
      "If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder.",
    );

    setLoading(false);
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
            Reset your password
          </h1>

          <p className="mt-2 text-sm text-[#8b99a5]">
            Enter your account email and we will send you a password reset link.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium">
            Email address

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
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
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 block text-center text-sm text-[#6d7f38] underline"
        >
          Return to login
        </Link>
      </section>
    </main>
  );
}
