import { QueryHistory } from "@/types";
import { SQLDatabase } from "@/lib/dexie";

const dexieDb = new SQLDatabase();

export const saveQueryHistory = async (
  history: QueryHistory
): Promise<void> => {
  try {
    await dexieDb.queryHistoryTable.add(history);
  } catch (err) {
    console.error("Failed to save query history:", err);
    throw err;
  }
};

export const getQueryHistory = async (): Promise<QueryHistory[]> => {
  try {
    return await dexieDb.queryHistoryTable.toArray();
  } catch (err) {
    console.error("Failed to get query history:", err);
    throw err;
  }
};

export const deleteQueryHistory = async (id: string): Promise<void> => {
  try {
    await dexieDb.queryHistoryTable.delete(id);
  } catch (err) {
    console.error("Failed to delete query history:", err);
    throw err;
  }
};

export const deleteAllQueryHistory = async (): Promise<void> => {
  try {
    await dexieDb.queryHistoryTable.clear();
  } catch (err) {
    console.error("Failed to delete all query history:", err);
    throw err;
  }
};
