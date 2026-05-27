"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, CheckCircle2, Sparkles } from "lucide-react";

const SM_LOGO_URL =
  "https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#faf9f5" }}>
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image
            src={SM_LOGO_URL}
            alt="Startup Miracle"
            width={56}
            height={56}
            className="rounded-full mb-4"
          />
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Workshop Portal
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Sign in with the email you registered with
          </p>
        </div>

        <Card className="border-zinc-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              {sent ? "Check your email" : "Sign in"}
            </CardTitle>
            <CardDescription>
              {sent
                ? `We sent a magic link to ${email}. Click it to access your portal.`
                : "Enter the email you used to register for the workshop."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-4" />
                <p className="text-sm text-zinc-600">
                  Didn&apos;t get it? Check your spam folder or{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-emerald-600 font-medium hover:underline"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-zinc-900 hover:bg-zinc-800"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Send magic link
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-zinc-400 mt-6">
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
