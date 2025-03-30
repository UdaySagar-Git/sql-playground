import { Table } from "@/types";
import { SqlValue } from "sql.js";
import { getDB, initializeSQL, resetDB } from "@/lib/sql";

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
    await executeSQLFilesFromDatasets();
  }
};

const executeSQLFilesFromDatasets = async (): Promise<void> => {
  const db = getDB();
  if (!db) {
    throw new Error("Database not initialized");
  }

  const sqlFiles = [
    "categories.sql",
    "regions.sql",
    "territories.sql",
    "customers.sql",
    "employees.sql",
    "employee_territories.sql",
    "shippers.sql",
    "suppliers.sql",
    "products.sql",
    "orders.sql",
    "order_details.sql",
  ];

  try {
    for (const file of sqlFiles) {
      let sqlContent = "";
      try {
        const response = await fetch(`/mock/datasets/${file}`);
        sqlContent = await response.text();
      } catch (fetchError) {
        console.error(`Error fetching SQL file ${file}:`, fetchError);
        continue;
      }

      if (sqlContent) {
        try {
          db.exec(sqlContent);
          console.log(`Successfully executed SQL file: ${file}`);
        } catch (execError) {
          console.error(`Error executing SQL in file ${file}:`, execError);
        }
      }
    }
  } catch (err) {
    console.error("Error executing SQL files:", err);
    throw err;
  }
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
