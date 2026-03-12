import React from "react";
import { RiskLevel } from "@/types";
import { riskColors } from "@/lib/utils";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";

interface RiskBadgeProps {
  risk: RiskLevel;
  showIcon?: boolean;
  size?: "sm" | "md";
}

const icons: Record<RiskLevel, React.ReactNode> = {
  high: <AlertTriangle className="w-3.5 h-3.5" />,
  medium: <AlertCircle className="w-3.5 h-3.5" />,
  low: <CheckCircle className="w-3.5 h-3.5" />,
};

export function RiskBadge({ risk, showIcon = true, size = "md" }: RiskBadgeProps) {
  const colors = riskColors[risk];
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs gap-1" : "px-2.5 py-1 text-sm gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full capitalize ${sizeClasses} ${colors}`}
    >
      {showIcon && icons[risk]}
      {risk} Risk
    </span>
  );
}
