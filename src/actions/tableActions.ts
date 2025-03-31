import { Table } from "@/types";
import { SqlValue } from "sql.js";
import { getDB, initializeSQL, resetDB } from "@/lib/sql";
import { mockTables } from "@/mock/tables";
import { dexieDb } from "@/lib/dexie";
import { generateId } from "@/lib/utils";
import { sqlFiles } from "@/mock/datasets";
import { SAMPLE_QUERY2, SAMPLE_QUERY3 } from "@/lib/constants";
import { mockQueries } from "@/mock/queries";

export const initializeSQLService = async (
  skipSQLInit = false
): Promise<boolean> => {
  try {
    let success = true;

    if (!skipSQLInit) {
      success = await initializeSQL();
    }

    if (success) {
      await initializeTables();
      await initializeSavedQueries();
      await initializeQueryHistory();
      return true;
    }
    return false;
  } catch {
    resetDB();
    return false;
  }
};

const initializeSavedQueries = async (): Promise<void> => {
  try {
    const count = await dexieDb.savedQueriesTable.count();

    if (count === 0) {
      const promises = Object.entries(sqlFiles).map(
        async ([sqlFileKey, sqlContent]) => {
          const displayName = `Create ${sqlFileKey}`;
          try {
            await dexieDb.savedQueriesTable.add({
              id: generateId(),
              sql: sqlContent,
              displayName,
              timestamp: new Date(),
            });
          } catch (err) {
            console.error(
              `Error creating query history for ${sqlFileKey}:`,
              err
            );
          }
        }
      );

      await Promise.all(promises);

      await dexieDb.savedQueriesTable.add({
        id: generateId(),
        sql: SAMPLE_QUERY2,
        displayName: "Sample Employee Query",
        timestamp: new Date(),
      });

      await dexieDb.savedQueriesTable.add({
        id: generateId(),
        sql: SAMPLE_QUERY3,
        displayName: "Generate 100000 rows",
        timestamp: new Date(),
      });
    }
  } catch (err) {
    console.error("Failed to initialize saved queries:", err);
  }
};

const initializeQueryHistory = async (): Promise<void> => {
  try {
    const count = await dexieDb.queryHistoryTable.count();

    if (count === 0) {
      const promises = mockQueries.map((query) => {
        return dexieDb.queryHistoryTable.add(query);
      });

      await Promise.all(promises);
    }
  } catch (err) {
    console.error("Failed to initialize query history:", err);
  }
};

export const getTables = async (): Promise<Table[]> => {
  try {
    const db = getDB();
    if (!db) {
      await initializeSQL();
      return [];
    }

    return getTablesFromDB();
  } catch (err) {
    throw err;
  }
};

const initializeTables = async (): Promise<void> => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not initialized");
  }

  const tablesResult = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );
  const tableCount = tablesResult[0]?.values.length || 0;

  if (tableCount === 0) {
    for (const table of mockTables) {
      await createTableFromInfo(table);
    }
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

export const getTablesFromDB = (): Table[] => {
  const db = getDB();
  if (!db) {
    return [];
  }

  const tablesResult = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table'"
  );

  if (!tablesResult[0] || !tablesResult[0].values.length) {
    return [];
  }

  const tableNames = tablesResult[0].values.map((row) => String(row[0]));

  return tableNames
    .map((tableName) => getTableInfoSync(tableName))
    .filter((table) => table !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getTableRowCount = (tableName: string): number => {
  const db = getDB();
  if (!db) return 0;

  try {
    const result = db.exec(`SELECT COUNT(*) FROM ${tableName}`);
    if (result.length > 0 && result[0].values.length > 0) {
      return Number(result[0].values[0][0]);
    }
    return 0;
  } catch (err) {
    console.error(`Error getting row count for ${tableName}:`, err);
    return 0;
  }
};

export const getTableInfoSync = (tableName: string): Table => {
  const db = getDB();
  if (!db) throw new Error("Database not initialized");

  const tableInfo = db.exec(`PRAGMA table_info(${tableName})`);
  const columns = tableInfo[0].values.map((row) => {
    return {
      name: String(row[1]),
      type: String(row[2]),
    };
  });

  const dataResult = db.exec(`SELECT * FROM ${tableName} LIMIT 100`);
  const values = dataResult[0]?.values || [];

  const objectData = values.map((row) => {
    const obj: Record<string, SqlValue> = {};
    columns.forEach((col, index) => {
      obj[col.name] = row[index] as SqlValue;
    });
    return obj;
  });

  const rowCount = getTableRowCount(tableName);

  return {
    name: tableName,
    columns,
    data: objectData,
    rowCount,
  };
};
