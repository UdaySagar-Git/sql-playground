import { QueryResult } from "@/types";
import { SqlValue } from "sql.js";
import { getDB } from "@/lib/sql";
import { syncTablesWithIndexedDB } from "./tableActions";

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

const convertSqlValue = (value: unknown): SqlValue => {
  if (value === null) return null;
  if (value instanceof Uint8Array) return value.toString();
  return value as SqlValue;
};
