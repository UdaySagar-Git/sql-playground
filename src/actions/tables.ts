import { Table } from "@/types";
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
