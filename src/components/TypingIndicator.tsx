import React from "react";

interface TypingIndicatorProps {
  visible: boolean;
}

export default function TypingIndicator({ visible }: TypingIndicatorProps) {
  if (!visible) return null;

  return (
    <div className="flex items-end gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
        <span className="text-white text-[10px] font-bold">✦</span>
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 mb-1 px-1">
          Buddy
        </span>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 inline-block"
                style={{ animation: `dotBounce 1.4s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
