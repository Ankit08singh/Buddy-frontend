import React from "react";
import { getInitials, hashStringToColor, cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = hashStringToColor(name);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white shadow-sm ring-1 ring-white/10 shrink-0",
        sizeClasses[size],
        bgColor,
        className
      )}
    >
      {initials}
    </div>
  );
}
