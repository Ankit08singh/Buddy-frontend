import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/chat");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center animate-pulse shadow-xl shadow-primary/20">
            <span className="text-(--primary-foreground) text-lg font-serif">B</span>
          </div>
          <span className="text-sm font-medium text-(--muted-foreground) tracking-wide">Validating...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In — Buddy</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4 bg-(--background) relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 transition-transform group-hover:rotate-3">
                <span className="text-primary-foreground text-2xl font-serif">B</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-(--foreground) tracking-tight">Welcome back</h1>
            <p className="text-(--muted-foreground) mt-2">Sign in to your Buddy companion</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/5 border border-white/20 dark:border-slate-700/50 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-(--foreground) px-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-(--foreground) px-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-(--muted-foreground) hover:text-primary transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link href="#" className="text-sm font-medium text-primary hover:text-accent transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-primary hover:bg-emerald-900 text-primary-foreground font-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] outline-none ring-offset-2 focus:ring-2 focus:ring-primary"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading ? "Signing in..." : "Sign in to Buddy"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-(--muted-foreground)">
                New to Buddy?{" "}
                <Link href="/auth/register" className="text-primary hover:text-accent font-bold transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
