"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


import { api, setAuthToken } from "@/lib/api";
import { tokenStore } from "@/lib/auth";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { email, password });
      const token = res.data.access_token as string;

      tokenStore.set(token);
      setAuthToken(token);

      router.push("/dashboard");
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Make an account to start tracking portfolios.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          <Button disabled={loading} className="w-full">
            {loading ? "Creating..." : "Create account"}
          </Button>
        </form>

        {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

        <p className="mt-4 text-sm text-zinc-400">
          Already have an account?{" "}
          <a className="text-zinc-100 underline" href="/login">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
