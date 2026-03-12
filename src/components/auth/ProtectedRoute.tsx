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

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
