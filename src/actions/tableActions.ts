import { Table } from "@/types";
import { SqlValue } from "sql.js";
import { dexieDb } from "@/lib/dexie";
import { getDB, initializeSQL, resetDB } from "@/lib/sql";
import { mockTables } from "@/mock/tables";

export const initializeSQLService = async (): Promise<boolean> => {
  try {
    const success = await initializeSQL();
    if (success) {
      await initializeTables();
      return true;
    }
    return false;
  } catch {
    resetDB();
    return false;
  }
};

export const getTables = async (): Promise<Table[]> => {
  try {
    const db = getDB();
    if (!db) {
      await initializeSQL();
    }

    const tables = await dexieDb.tablesTable.toArray();
    return tables.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    throw err;
  }
};

const initializeTables = async (): Promise<void> => {
  const existingTables = await dexieDb.tablesTable.count();
  const tablesToInitialize =
    existingTables === 0 ? mockTables : await dexieDb.tablesTable.toArray();

  for (const table of tablesToInitialize) {
    await createTableFromInfo(table);
  }
};

const createTableFromInfo = async (table: Table): Promise<void> => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not initialized");
  }

  try {
    const dropSQL = `DROP TABLE IF EXISTS ${table.name}`;
    db.exec(dropSQL);

    const columnDefs = table.columns
      .map((col) => `${col.name} ${col.type}`)
      .join(", ");
    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${table.name} (${columnDefs})`;
    db.exec(createTableSQL);

    if (table.data?.length) {
      await insertTableData(table);
    }

    await dexieDb.tablesTable.put(table);
  } catch (err) {
    throw err;
  }
};

const insertTableData = async (table: Table): Promise<void> => {
  const db = getDB();
  if (!db) return;

  try {
    // to avoid race conditions
    db.exec("BEGIN TRANSACTION");

    for (const row of table.data!) {
      const values = table.columns
        .map((col) => {
          const val = row[col.name];
          return formatSqlValue(val);
        })
        .join(", ");
      const insertSQL = `INSERT INTO ${table.name} VALUES (${values})`;
      db.exec(insertSQL);
    }

    db.exec("COMMIT");
  } catch (err) {
    try {
      db.exec("ROLLBACK");
    } catch {}
    throw err;
  }
};

const formatSqlValue = (val: unknown): string => {
  if (val === null) return "NULL";
  if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
  return String(val);
};

export const syncTablesWithIndexedDB = async (): Promise<void> => {
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

export const getTableInfo = async (tableName: string): Promise<Table> => {
  const db = getDB();
  if (!db) throw new Error("Database not initialized");

  const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
  const columns = tableInfo[0].values.map((row) => {
    return {
      name: String(row[1]),
      type: String(row[2]),
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
