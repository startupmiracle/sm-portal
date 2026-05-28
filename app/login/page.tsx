"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Mail, Lock, Loader2, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

const SM_LOGO_URL =
  "https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/workshops");
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Textured gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #faf9f5 0%, #f0ebe3 25%, #e8e0d4 50%, #f5f0e8 75%, #faf9f5 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/[0.04] blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-amber-400/[0.05] blur-3xl" />

      <div className="relative w-full max-w-[420px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl scale-150" />
            <Image
              src={SM_LOGO_URL}
              alt="Startup Miracle"
              width={64}
              height={64}
              className="relative rounded-2xl shadow-lg"
            />
          </div>
          <h1
            className="text-[28px] font-bold tracking-tight text-zinc-900"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <span className="text-zinc-900">Startup</span>
            <span className="text-emerald-600">Miracle</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5 tracking-wide">
            Workshop Portal
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl border border-white/60 p-8 backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 100%)",
            boxShadow:
              "0 4px 24px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {sent ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2
                className="text-xl font-semibold text-zinc-900 mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Check your email
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px]">
                We sent a magic link to{" "}
                <span className="font-medium text-zinc-700">{email}</span>.
                Click it to access your portal.
              </p>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent my-6" />
              <p className="text-xs text-zinc-400">
                Didn&apos;t get it? Check spam or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="text-emerald-600 font-medium hover:underline"
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2
                  className="text-xl font-semibold text-zinc-900 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                  Sign in
                </h2>
                <p className="text-sm text-zinc-500 mt-1.5">
                  Enter the email you used to register for the workshop.
                </p>
              </div>

              <form
                onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
                className="space-y-4"
              >
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-200 bg-white/80 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {mode === "password" && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-zinc-200 bg-white/80 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email || (mode === "password" && !password)}
                  className="group w-full h-12 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: loading
                      ? "rgb(16, 185, 129)"
                      : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    boxShadow:
                      "0 2px 8px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "password" ? "Sign in" : "Send magic link"}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="w-full h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent my-6" />

              <button
                onClick={() => {
                  setMode(mode === "password" ? "magic" : "password");
                  setError(null);
                }}
                className="w-full flex items-center justify-center gap-2 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                {mode === "password" ? (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    Sign in with magic link instead
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Sign in with password instead
                  </>
                )}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-zinc-400 mt-8">
          Powered by{" "}
          <a
            href="https://startupmiracle.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-600 transition-colors"
          >
            Startup Miracle
          </a>
        </p>
      </div>
    </div>
  );
}
