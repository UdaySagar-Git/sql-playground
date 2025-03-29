import { SqlValue } from "sql.js";

export interface Tab {
  id: string;
  name: string;
  query?: string;
}

export interface QueryResult {
  columns: string[];
  values: SqlValue[][];
}

export interface Table {
  name: string;
  columns: {
    name: string;
    type: string;
  }[];
  data?: Record<string, SqlValue>[];
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

export interface QuerySearchOptions {
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface SQLServiceInterface {
  initialize(): Promise<boolean>;
  executeQuery(sql: string): Promise<QueryResult[]>;
  getTables(): Promise<Table[]>;
  saveQuery(query: SavedQuery): Promise<void>;
  getSavedQueries(): Promise<SavedQuery[]>;
  deleteQuery(id: string): Promise<void>;
  updateQuery(id: string, displayName: string | undefined): Promise<void>;
  saveQueryHistory(history: QueryHistory): Promise<void>;
  getQueryHistory(): Promise<QueryHistory[]>;
}
