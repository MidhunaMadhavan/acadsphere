"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setMessage(
          "Account created. Check your email to confirm your account.",
        );
      } else {
        router.push("/dashboard");
        router.refresh();
      }

      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    const next = searchParams.get("next") || "/dashboard";

    router.push(next);
    router.refresh();
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8fafb] px-6 py-12 text-[#263646]">
      <section className="mx-auto max-w-md rounded-2xl border border-[#e7ecef] bg-white p-8 shadow-sm">
        <div className="mb-8">
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#d8e75c] text-xl font-bold text-[#101d2d]">
            A
          </div>

          <p className="text-xs uppercase tracking-[0.16em] text-[#8b99a5]">
            Axiom Academic Systems
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>

          <p className="mt-2 text-sm text-[#8b99a5]">
            {mode === "login"
              ? "Sign in to access your academic workspace."
              : "Create a student account for the academic platform."}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="block text-sm font-medium">
              Full name
              <input
                className="mt-2 w-full rounded-lg border border-[#dfe6ea] px-3 py-2 text-sm outline-none focus:border-[#b7c857]"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </label>
          )}

          <label className="block text-sm font-medium">
            Email
            <input
              type="email"
              className="mt-2 w-full rounded-lg border border-[#dfe6ea] px-3 py-2 text-sm outline-none focus:border-[#b7c857]"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              type="password"
              minLength={6}
              className="mt-2 w-full rounded-lg border border-[#dfe6ea] px-3 py-2 text-sm outline-none focus:border-[#b7c857]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          {message && (
            <p className="rounded-lg bg-[#f4f8dc] p-3 text-sm text-[#667c2d]">
              {message}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full rounded-lg bg-[#101d2d] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </button>
        </form>

        <button
          className="mt-6 w-full text-sm text-[#6d7f38] underline"
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setMessage("");
          }}
        >
          {mode === "login"
            ? "Need an account? Create one"
            : "Already have an account? Sign in"}
        </button>
      </section>
    </main>
  );
}
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="grid min-h-screen place-items-center bg-[#f8fafb] text-[#263646]">
          Loading login...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

