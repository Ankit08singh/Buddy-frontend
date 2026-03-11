import React, { useState } from "react";
import { Search, User } from "lucide-react";

interface EmployeeSelectorProps {
  onSelect: (userId: string) => void;
  currentUserId: string;
}

export default function EmployeeSelector({ onSelect, currentUserId }: EmployeeSelectorProps) {
  const [value, setValue] = useState(currentUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSelect(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter employee ID..."
          className="pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
          aria-label="Employee user ID"
        />
      </div>

      <button
        type="submit"
        disabled={!value.trim()}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-teal-600 text-white hover:bg-teal-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
      >
        Load Data
      </button>

      {currentUserId && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800">
          <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-sm font-medium text-teal-700 dark:text-teal-300">{currentUserId}</span>
        </div>
      )}
    </form>
  );
}
