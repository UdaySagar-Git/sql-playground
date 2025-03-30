import initSqlJs, { Database } from "sql.js";

let dbInstance: Database | null = null;
let isInitializing = false;
let initPromise: Promise<boolean> | null = null;

export const lazyInitializeSQL = (): void => {
  if (!dbInstance && !isInitializing) {
    initializeSQL().catch(console.error);
  }
};

export const initializeSQL = async (): Promise<boolean> => {
  if (isInitializing && initPromise) {
    return initPromise;
  }

  if (dbInstance) {
    return true;
  }

  isInitializing = true;

  initPromise = new Promise<boolean>(async (resolve) => {
    try {
      const SQL = await initSqlJs({
        locateFile: () => `/sql-wasm.wasm`,
      });

      dbInstance = new SQL.Database();
      isInitializing = false;
      resolve(true);
    } catch {
      isInitializing = false;
      resolve(false);
    }
  });

  return initPromise;
};

export const getDB = (): Database | null => {
  return dbInstance;
};

export const resetDB = (): void => {
  if (dbInstance) {
    try {
      dbInstance.close();
    } catch {}
  }
  dbInstance = null;
  isInitializing = false;
  initPromise = null;
};
