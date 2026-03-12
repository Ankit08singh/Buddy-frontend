import React from "react";
import { Emotion } from "@/types";
import { emotionColors } from "@/lib/utils";

interface EmotionBadgeProps {
  emotion: Emotion;
  size?: "sm" | "md";
}

export function EmotionBadge({ emotion, size = "md" }: EmotionBadgeProps) {
  const colors = emotionColors[emotion];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full capitalize ${sizeClasses} ${colors}`}
    >
      {emotion}
    </span>
  );
}
