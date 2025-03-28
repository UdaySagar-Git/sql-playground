/**
 * SQL Service using sql.js
 * @see https://github.com/sql-js/sql.js#usage
 */

import initSqlJs, { Database, SqlValue } from "sql.js";
import { QueryResult } from "@/types";

export interface SQLServiceInterface {
  initialize(): Promise<boolean>;
  executeQuery(sql: string): QueryResult[];
  createTable(
    tableName: string,
    columns: string[],
    data: SqlValue[][]
  ): boolean;
}

export class SQLService implements SQLServiceInterface {
  private db: Database | null = null;

  async initialize(): Promise<boolean> {
    try {
      const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
      });
      this.db = new SQL.Database();
      return true;
    } catch (err) {
      console.error("Failed to initialize SQL.js:", err);
      return false;
    }
  }

  private convertSqlValue(value: SqlValue) {
    if (value === null) return null;
    if (typeof value === "string") return value;
    if (typeof value === "number") return value;
    if (value instanceof Uint8Array) return value.toString();
    return String(value);
  }

  executeQuery(sql: string): QueryResult[] {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const results = this.db.exec(sql);
      return results.map((result) => ({
        columns: result.columns,
        values: result.values.map((row) => row.map(this.convertSqlValue)),
      }));
    } catch (err) {
      console.error("Query execution error:", err);
      throw err;
    }
  }

  createTable(
    tableName: string,
    columns: string[],
    data: SqlValue[][]
  ): boolean {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const columnDefs = columns.map((col) => `${col} TEXT`).join(", ");
      const createTableSQL = `CREATE TABLE ${tableName} (${columnDefs})`;
      this.db.exec(createTableSQL);

      data.forEach((row) => {
        const values = row.map((val) => `'${val}'`).join(", ");
        const insertSQL = `INSERT INTO ${tableName} VALUES (${values})`;
        this.db?.exec(insertSQL);
      });

      return true;
    } catch (err) {
      console.error(`Failed to create table ${tableName}:`, err);
      return false;
    }
  }
}
