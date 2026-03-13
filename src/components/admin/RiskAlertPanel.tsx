import React from "react";
import { AlertTriangle, Clock, User } from "lucide-react";
import { RiskAlert } from "@/types";
import { formatRiskLevel } from "@/lib/adminUtils";

interface RiskAlertPanelProps {
  alerts: RiskAlert[];
  onAlertClick: (employeeId: string) => void;
  maxDisplay?: number;
}

export function RiskAlertPanel({ 
  alerts, 
  onAlertClick, 
  maxDisplay = 5 
}: RiskAlertPanelProps) {
  const displayedAlerts = alerts.slice(0, maxDisplay);
  const hasMoreAlerts = alerts.length > maxDisplay;

  if (alerts.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Risk Alerts
        </h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            No high-risk employees at this time
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Risk Alerts
        </h3>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {alerts.length} employee{alerts.length !== 1 ? "s" : ""} need attention
        </span>
      </div>

      <div className="space-y-3">
        {displayedAlerts.map((alert) => {
          const riskDisplay = formatRiskLevel(alert.level);
          
          return (
            <div
              key={alert.employee_id}
              onClick={() => onAlertClick(alert.employee_id)}
              className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-slate-900 dark:text-white truncate">
                    {alert.employee_name}
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskDisplay.bgColor} ${riskDisplay.textColor}`}>
                    {alert.urgency} priority
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                  {alert.primary_concern}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {alert.days_since_last_session} days since last session
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="capitalize">
                      {alert.vibe_score_trend} trend
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {hasMoreAlerts && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View all {alerts.length} alerts
          </button>
        </div>
      )}
    </div>
  );
}