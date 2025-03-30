import { SqlValue } from "sql.js";

export interface Column {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  columns: Column[];
  data?: Record<string, SqlValue>[];
  rowCount?: number;
}

export interface QueryResult {
  columns: string[];
  values: SqlValue[][];
  executionTime?: number;
  shouldRevalidateTables?: boolean;
}

export interface Tab {
  id: string;
  query?: string;
}

export interface SavedQuery {
  id: string;
  sql: string;
  displayName?: string;
  timestamp: Date;
}

export interface QueryHistory {
  id: string;
  sql: string;
  displayName?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
  hasMore: boolean;
  totalCount?: number;
}

export interface PaginationParams {
  limit: number;
  cursor?: string | null;
  searchTerm?: string;
}

export interface PaginationSettings {
  currentPage: number;
  pageSize: number;
  totalRows: number;
}

export enum ChartType {
  BAR = "bar",
  LINE = "line",
  PIE = "pie",
  SCATTER = "scatter",
}

export interface ChartConfig {
  type: ChartType;
  title?: string;
}

export interface ChartMappings {
  xAxis?: string;
  yAxis?: string;
  category?: string;
  value?: string;
}

export interface VisualizationState {
  activeTab: "data" | "visualization";
  selectedChartType: ChartType;
  chartMappings: ChartMappings;
}
