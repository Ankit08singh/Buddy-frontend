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
      className={`rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 ${sizeClasses[size]} ${className}`}
    >
      B
    </div>
  );
}
