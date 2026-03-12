import React from "react";
import { getInitials, hashStringToColor } from "@/lib/utils";

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
      className={`rounded-full flex items-center justify-center font-medium text-white ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
}
