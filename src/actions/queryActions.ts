import { SavedQuery } from "@/types";
import { dexieDb } from "@/lib/dexie";

export const saveQuery = async (query: SavedQuery): Promise<void> => {
  try {
    await dexieDb.savedQueriesTable.put(query);
  } catch (err) {
    console.error("Failed to save query:", err);
    throw err;
  }
};

export const updateQuery = async (
  id: string,
  displayName: string | undefined
): Promise<void> => {
  try {
    const query = await dexieDb.savedQueriesTable.get(id);
    if (!query) {
      throw new Error("Query not found");
    }
    await dexieDb.savedQueriesTable.put({
      ...query,
      displayName,
    });
  } catch (err) {
    console.error("Failed to update query:", err);
    throw err;
  }
};

export const getSavedQueries = async (): Promise<SavedQuery[]> => {
  try {
    return await dexieDb.savedQueriesTable.toArray();
  } catch (err) {
    console.error("Failed to get saved queries:", err);
    throw err;
  }
};

export const deleteQuery = async (id: string): Promise<void> => {
  try {
    await dexieDb.savedQueriesTable.delete(id);
  } catch (err) {
    console.error("Failed to delete query:", err);
    throw err;
  }
};
