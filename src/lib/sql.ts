import initSqlJs, { Database } from "sql.js";

let dbInstance: Database | null = null;

export const initializeSQL = async (): Promise<boolean> => {
  try {
    const SQL = await initSqlJs({
      locateFile: () => "/sql-wasm.wasm",
    });

    dbInstance = new SQL.Database();
    return true;
  } catch (err) {
    console.error("Failed to initialize SQL.js:", err);
    return false;
  }
};

export const getDB = (): Database | null => {
  return dbInstance;
};
