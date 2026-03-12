import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/components/providers/AuthProvider";
import type { Role } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.replace(user.role === "admin" ? "/admin" : "/chat");
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center animate-pulse">
            <span className="text-white text-sm font-bold">B</span>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
