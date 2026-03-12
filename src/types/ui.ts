import type { 
  RiskLevel, 
  SortField, 
  SortDirection, 
  FilterTimeRange, 
  ActiveStatus 
} from "./enums";
import type { Employee, TeamStats, RiskAlert } from "./admin";

// UI state management types
export interface FilterState {
  search: string;
  departments: string[];
  riskLevels: RiskLevel[];
  activityStatus: ActiveStatus;
  timeRange: FilterTimeRange;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface LoadingState {
  employees: boolean;
  trends: boolean;
  stats: boolean;
}

export interface ErrorState {
  employees: string | null;
  trends: string | null;
  stats: string | null;
}

export interface AdminDashboardState {
  employees: Employee[];
  selectedEmployee: string | null;
  filters: FilterState;
  loading: LoadingState;
  errors: ErrorState;
  teamStats: TeamStats | null;
}

// Form types for filters and exports
export interface EmployeeFiltersForm {
  search: string;
  departments: string[];
  riskLevels: RiskLevel[];
  activityStatus: ActiveStatus;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface ExportConfigForm {
  format: "csv" | "json";
  dateRange: { start: Date; end: Date };
  employees: string[];
  includePersonalData: boolean;
}