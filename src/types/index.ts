export interface Tab {
  id: string;
  name: string;
  query: string;
}

export interface Column {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Query {
  id: string;
  sql: string;
  displayName?: string;
  timestamp: Date;
}

export interface ResultRow {
  [key: string]: string | number;
}
