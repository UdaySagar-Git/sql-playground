import Dexie, { Table } from "dexie";
import { Table as TableType, SavedQuery, QueryHistory } from "@/types";

export class SQLDatabase extends Dexie {
  constructor() {
    super("SQLDatabase");
    this.version(1).stores({
      tables: "++id, name",
      savedQueries: "++id, displayName, timestamp",
      queryHistory: "++id, timestamp",
    });
  }

  get tablesTable(): Table<TableType, number> {
    return this.table("tables");
  }

  get savedQueriesTable(): Table<SavedQuery, string> {
    return this.table("savedQueries");
  }

  get queryHistoryTable(): Table<QueryHistory, string> {
    return this.table("queryHistory");
  }
}

export const dexieDb = new SQLDatabase();
