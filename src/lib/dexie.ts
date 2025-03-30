import Dexie, { Table } from "dexie";
import { SavedQuery, QueryHistory } from "@/types";

export class SQLDatabase extends Dexie {
  constructor() {
    super("SQLDatabase");
    this.version(1).stores({
      savedQueries: "++id, displayName, timestamp",
      queryHistory: "++id, displayName, timestamp",
    });
  }

  get savedQueriesTable(): Table<SavedQuery, string> {
    return this.table("savedQueries");
  }

  get queryHistoryTable(): Table<QueryHistory, string> {
    return this.table("queryHistory");
  }
}

export const dexieDb = new SQLDatabase();
