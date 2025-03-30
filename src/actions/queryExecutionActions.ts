import { QueryResult } from "@/types";
import { SqlValue } from "sql.js";
import { getDB } from "@/lib/sql";

const DDL_COMMANDS =/^\s*(CREATE|ALTER|DROP|TRUNCATE|create|alter|drop|truncate)/im;
const DML_COMMANDS = /^\s*(INSERT|UPDATE|DELETE|insert|update|delete)/im;

export const executeQuery = async (sql: string): Promise<QueryResult[]> => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const startTime = performance.now();
    const results = db.exec(sql);
    const executionTime = performance.now() - startTime;

    const hasDDL = DDL_COMMANDS.test(sql);
    const hasDML = DML_COMMANDS.test(sql);

    const shouldRevalidateTables = hasDDL || hasDML;

    if (results.length === 0 && shouldRevalidateTables) {
      return [
        {
          columns: [],
          values: [],
          executionTime,
          shouldRevalidateTables: true,
        },
      ];
    }

    return results.map((result) => ({
      columns: result.columns,
      values: result.values.map((row) => row.map(convertSqlValue)),
      executionTime,
      shouldRevalidateTables,
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
