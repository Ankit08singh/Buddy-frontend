import React from "react";

interface LoadingSkeletonProps {
  className?: string;
}

export function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex items-start gap-3 p-4">
      <LoadingSkeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <LoadingSkeleton className="h-4 w-1/4" />
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-slate-100 dark:border-slate-700">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <LoadingSkeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-32" />
            <LoadingSkeleton className="h-3 w-24" />
          </div>
        </div>
      </td>
      <td className="p-4"><LoadingSkeleton className="h-6 w-20" /></td>
      <td className="p-4"><LoadingSkeleton className="h-6 w-16" /></td>
      <td className="p-4"><LoadingSkeleton className="h-2 w-full" /></td>
      <td className="p-4"><LoadingSkeleton className="h-6 w-20" /></td>
    </tr>
  );
}
