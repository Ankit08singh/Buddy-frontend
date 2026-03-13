import React from "react";

interface BuddyAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-lg",
  lg: "w-12 h-12 text-xl",
};

export function BuddyAvatar({ size = "md", className = "" }: BuddyAvatarProps) {
  return (
    <div
      className={`rounded-xl bg-linear-to-br from-emerald-600 to-emerald-800 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform ${sizeClasses[size]} ${className}`}
    >
      B
    </div>
  );
}
