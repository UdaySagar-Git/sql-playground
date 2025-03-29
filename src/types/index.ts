import { SqlValue } from "sql.js";

export interface Column {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  columns: Column[];
  data?: Record<string, SqlValue>[];
}

export interface QueryResult {
  columns: string[];
  values: SqlValue[][];
}

export interface Tab {
  id: string;
  name: string;
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
  timestamp: Date;
  results?: QueryResult;
}
