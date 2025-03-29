import { SavedQuery, QueryHistory, QueryResult, Table } from "@/types";
import { SqlValue } from "sql.js";
import { dexieDb } from "@/lib/dexie";
import { getDB } from "@/lib/sql";

const DDL_COMMANDS = /^(CREATE|ALTER|DROP|TRUNCATE)/i;

export const executeQuery = async (sql: string): Promise<QueryResult[]> => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const results = db.exec(sql);
    const isDDL = DDL_COMMANDS.test(sql.trim());

    if (isDDL) {
      await syncTablesWithIndexedDB();
    }

    return results.map((result) => ({
      columns: result.columns,
      values: result.values.map((row) => row.map(convertSqlValue)),
    }));
  } catch (err) {
    console.error("Query execution error:", err);
    throw err;
  }
};

export const saveQuery = async (query: SavedQuery): Promise<void> => {
  try {
    await dexieDb.savedQueriesTable.put(query);
  } catch (err) {
    console.error("Failed to save query:", err);
    throw err;
  }
};

export const updateQuery = async (
  id: string,
  displayName: string | undefined
): Promise<void> => {
  try {
    const query = await dexieDb.savedQueriesTable.get(id);
    if (!query) {
      throw new Error("Query not found");
    }
    await dexieDb.savedQueriesTable.put({
      ...query,
      displayName,
    });
  } catch (err) {
    console.error("Failed to update query:", err);
    throw err;
  }
};

export const getSavedQueries = async (): Promise<SavedQuery[]> => {
  try {
    return await dexieDb.savedQueriesTable.toArray();
  } catch (err) {
    console.error("Failed to get saved queries:", err);
    throw err;
  }
};

export const deleteQuery = async (id: string): Promise<void> => {
  try {
    await dexieDb.savedQueriesTable.delete(id);
  } catch (err) {
    console.error("Failed to delete query:", err);
    throw err;
  }
};

export const saveQueryHistory = async (
  history: QueryHistory
): Promise<void> => {
  try {
    await dexieDb.queryHistoryTable.put(history);
  } catch (err) {
    console.error("Failed to save query history:", err);
    throw err;
  }
};

export const getQueryHistory = async (): Promise<QueryHistory[]> => {
  try {
    return await dexieDb.queryHistoryTable.toArray();
  } catch (err) {
    console.error("Failed to get query history:", err);
    throw err;
  }
};

const convertSqlValue = (value: unknown): SqlValue => {
  if (value === null) return null;
  if (value instanceof Uint8Array) return value.toString();
  return value as SqlValue;
};

const syncTablesWithIndexedDB = async (): Promise<void> => {
  const db = getDB();
  if (!db) return;

  const tablesResult = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  const tableNames = tablesResult[0]?.values.map((row) => String(row[0])) || [];

  await dexieDb.tablesTable.clear();

  for (const tableName of tableNames) {
    const tableInfo = await getTableInfo(tableName);
    await dexieDb.tablesTable.put(tableInfo);
  }
};

const getTableInfo = async (tableName: string): Promise<Table> => {
  const db = getDB();
  if (!db) throw new Error("Database not initialized");

  const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
  const columns = tableInfo[0].values.map((row: unknown) => {
    const typedRow = row as [
      number,
      string,
      string,
      number,
      string | null,
      number
    ];
    return {
      name: typedRow[1],
      type: typedRow[2],
    };
  });

  const dataResult = db.exec(`SELECT * FROM ${tableName}`);
  const values = dataResult[0]?.values || [];

  const objectData = values.map((row) => {
    const obj: Record<string, SqlValue> = {};
    columns.forEach((col, index) => {
      obj[col.name] = row[index] as SqlValue;
    });
    return obj;
  });

  return {
    name: tableName,
    columns,
    data: objectData,
  };
};
