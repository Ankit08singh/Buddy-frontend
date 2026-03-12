import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

type RegisterType = "employee" | "admin";

export default function RegisterPage() {
  const router = useRouter();
  const { user, registerEmployee, registerAdmin, isLoading: authLoading } = useAuth();
  const [type, setType] = useState<RegisterType>("employee");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/chat");
    }
  }, [user, router]);

  const passwordChecks = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
  };
  const isPasswordValid = passwordChecks.length && passwordChecks.hasLetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all required fields");
      return;
    }

    if (!isPasswordValid) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      if (type === "employee") {
        await registerEmployee({
          name,
          email,
          password,
          department: department || undefined,
          job_title: jobTitle || undefined,
        });
      } else {
        await registerAdmin({ name, email, password });
      }
      toast.success("Account created successfully!");
    } catch (err: any) {
      setError(err.message || "Registration failed");
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
          <span className="text-sm font-medium text-(--muted-foreground) tracking-wide">Securing session...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Create Account — Buddy</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-(--background) relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-3xl" />

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20 transition-transform group-hover:rotate-3">
                <span className="text-primary-foreground text-2xl font-serif">B</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-(--foreground) tracking-tight">Create account</h1>
            <p className="text-(--muted-foreground) mt-2">Join your workplace companion</p>
          </div>

          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-primary/5 border border-white/20 dark:border-slate-700/50 p-8">
            <div className="flex p-1.5 bg-(--secondary) rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => setType("employee")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  type === "employee"
                    ? "bg-white dark:bg-slate-600 text-primary shadow-sm"
                    : "text-(--muted-foreground) hover:text-(--foreground)"
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setType("admin")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  type === "admin"
                    ? "bg-white dark:bg-slate-600 text-primary shadow-sm"
                    : "text-(--muted-foreground) hover:text-(--foreground)"
                }`}
              >
                Admin
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-(--foreground) px-1">
                  Full Name <span className="text-accent">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-(--foreground) px-1">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-(--foreground) px-1">
                  Password <span className="text-accent">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    autoComplete="new-password"
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
                {password && (
                  <div className="mt-2 flex items-center gap-3 text-xs px-1">
                    <span className={`flex items-center gap-1 font-medium ${passwordChecks.length ? "text-primary" : "text-(--muted-foreground)"}`}>
                      {passwordChecks.length ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      8+ chars
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${passwordChecks.hasLetter ? "text-primary" : "text-(--muted-foreground)"}`}>
                      {passwordChecks.hasLetter ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      Letter
                    </span>
                  </div>
                )}
              </div>

              {type === "employee" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="department" className="block text-sm font-semibold text-(--foreground) px-1">
                      Department
                    </label>
                    <input
                      id="department"
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Engineering"
                      className="w-full px-4 py-3 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="block text-sm font-semibold text-(--foreground) px-1">
                      Job Title
                    </label>
                    <input
                      id="jobTitle"
                      type="text"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="Developer"
                      className="w-full px-4 py-3 rounded-2xl border border-(--border) bg-white/50 dark:bg-slate-900/50 text-(--foreground) placeholder:text-(--muted-foreground) focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-primary hover:bg-emerald-900 text-primary-foreground font-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98] mt-4 outline-none ring-offset-2 focus:ring-2 focus:ring-primary"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading ? "Creating account..." : "Start Your Journey"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-(--muted-foreground)">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:text-accent font-bold transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
