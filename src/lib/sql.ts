/**
 * SQL Service using sql.js
 * @see https://github.com/sql-js/sql.js#usage
 */

import initSqlJs, { Database, SqlValue } from "sql.js";
import {
  SQLServiceInterface,
  Table,
  SavedQuery,
  QueryHistory,
  QueryResult,
} from "@/types";
import { SQLDatabase } from "./dexie";
import { mockTables } from "@/mock/tables";

const DDL_COMMANDS = /^(CREATE|ALTER|DROP|TRUNCATE)/i;

export class SQLService implements SQLServiceInterface {
  private db: Database | null = null;
  private dexieDb: SQLDatabase;

  constructor() {
    this.dexieDb = new SQLDatabase();
  }

  async initialize(): Promise<boolean> {
    try {
      const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
      });

      this.db = new SQL.Database();
      await this.initializeTables();
      return true;
    } catch (err) {
      console.error("Failed to initialize SQL.js:", err);
      return false;
    }
  }

  private async initializeTables(): Promise<void> {
    const existingTables = await this.dexieDb.tablesTable.count();
    const tablesToInitialize =
      existingTables === 0
        ? mockTables
        : await this.dexieDb.tablesTable.toArray();

    for (const table of tablesToInitialize) {
      await this.createTableFromInfo(table);
    }
  }

  private async createTableFromInfo(table: Table): Promise<void> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const columnDefs = table.columns
        .map((col) => `${col.name} ${col.type}`)
        .join(", ");
      const createTableSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (${columnDefs})`;
      this.db.exec(createTableSQL);

      if (table.data?.length) {
        await this.insertTableData(table);
      }

      await this.dexieDb.tablesTable.put(table);
    } catch (err) {
      console.error(`Failed to create table ${table.name}:`, err);
      throw err;
    }
  }

  private async insertTableData(table: Table): Promise<void> {
    if (!this.db) return;

    for (const row of table.data!) {
      const values = table.columns
        .map((col) => {
          const val = row[col.name];
          return this.formatSqlValue(val);
        })
        .join(", ");
      const insertSQL = `INSERT INTO ${table.name} VALUES (${values})`;
      this.db.exec(insertSQL);
    }
  }

  private formatSqlValue(val: SqlValue): string {
    if (val === null) return "NULL";
    if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
    return String(val);
  }

  async getTables(): Promise<Table[]> {
    try {
      return await this.dexieDb.tablesTable.toArray();
    } catch (err) {
      console.error("Failed to get tables from IndexedDB:", err);
      throw err;
    }
  }

  async executeQuery(sql: string): Promise<QueryResult[]> {
    if (!this.db) {
      throw new Error("Database not initialized");
    }

    try {
      const results = this.db.exec(sql);
      const isDDL = DDL_COMMANDS.test(sql.trim());

      if (isDDL) {
        await this.syncTablesWithIndexedDB();
      }

      return results.map((result) => ({
        columns: result.columns,
        values: result.values.map((row) => row.map(this.convertSqlValue)),
      }));
    } catch (err) {
      console.error("Query execution error:", err);
      throw err;
    }
  }

  private async syncTablesWithIndexedDB(): Promise<void> {
    if (!this.db) return;

    const tablesResult = this.db.exec(
      "SELECT name FROM sqlite_master WHERE type='table'"
    );
    const tableNames =
      tablesResult[0]?.values.map((row) => String(row[0])) || [];

    await this.dexieDb.tablesTable.clear();

    for (const tableName of tableNames) {
      const tableInfo = await this.getTableInfo(tableName);
      await this.dexieDb.tablesTable.put(tableInfo);
    }
  }

  private async getTableInfo(tableName: string): Promise<Table> {
    if (!this.db) throw new Error("Database not initialized");

    const tableInfo = this.db.exec(`PRAGMA table_info(${tableName})`);
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

    const dataResult = this.db.exec(`SELECT * FROM ${tableName}`);
    const values = dataResult[0]?.values || [];

    const objectData = values.map((row) => {
      const obj: Record<string, SqlValue> = {};
      columns.forEach((col, index) => {
        obj[col.name] = row[index];
      });
      return obj;
    });

    return {
      name: tableName,
      columns,
      data: objectData,
    };
  }

  private convertSqlValue(value: SqlValue): SqlValue {
    if (value === null) return null;
    if (value instanceof Uint8Array) return value.toString();
    return value;
  }

  async saveQuery(query: SavedQuery): Promise<void> {
    try {
      await this.dexieDb.savedQueriesTable.put(query);
    } catch (err) {
      console.error("Failed to save query:", err);
      throw err;
    }
  }

  async updateQuery(
    id: string,
    displayName: string | undefined
  ): Promise<void> {
    try {
      const query = await this.dexieDb.savedQueriesTable.get(id);
      if (!query) {
        throw new Error("Query not found");
      }
      await this.dexieDb.savedQueriesTable.put({
        ...query,
        displayName,
      });
    } catch (err) {
      console.error("Failed to update query:", err);
      throw err;
    }
  }

  async getSavedQueries(): Promise<SavedQuery[]> {
    try {
      return await this.dexieDb.savedQueriesTable.toArray();
    } catch (err) {
      console.error("Failed to get saved queries:", err);
      throw err;
    }
  }

  async saveQueryHistory(history: QueryHistory): Promise<void> {
    try {
      await this.dexieDb.queryHistoryTable.put(history);
    } catch (err) {
      console.error("Failed to save query history:", err);
      throw err;
    }
  }

  async getQueryHistory(): Promise<QueryHistory[]> {
    try {
      return await this.dexieDb.queryHistoryTable.toArray();
    } catch (err) {
      console.error("Failed to get query history:", err);
      throw err;
    }
  }

  async deleteQuery(id: string): Promise<void> {
    try {
      await this.dexieDb.savedQueriesTable.delete(id);
    } catch (err) {
      console.error("Failed to delete query:", err);
      throw err;
    }
  }
}
