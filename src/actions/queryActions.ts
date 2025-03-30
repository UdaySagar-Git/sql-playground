import { SavedQuery, PaginatedResponse, PaginationParams } from "@/types";
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

export const getPaginatedSavedQueries = async (
  params: PaginationParams
): Promise<PaginatedResponse<SavedQuery>> => {
  try {
    const { limit, cursor, searchTerm } = params;

    let query = dexieDb.savedQueriesTable.orderBy("timestamp").reverse();

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      query = query.filter(
        (item) =>
          (item.displayName && item.displayName.toLowerCase().includes(term)) ||
          item.sql.toLowerCase().includes(term)
      );
    }

    const totalCountPromise =
      searchTerm && searchTerm.trim()
        ? query.clone().count()
        : dexieDb.savedQueriesTable.count();

    if (cursor) {
      const cursorItem = await dexieDb.savedQueriesTable.get(cursor);
      if (cursorItem) {
        query = query.filter(
          (item) =>
            item.timestamp < cursorItem.timestamp ||
            (item.timestamp.getTime() === cursorItem.timestamp.getTime() &&
              item.id < cursorItem.id)
        );
      }
    }

    const items = await query.limit(limit + 1).toArray();
    const totalCount = await totalCountPromise;

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const nextCursor =
      hasMore && data.length > 0 ? data[data.length - 1].id : null;

    return {
      data,
      nextCursor,
      hasMore,
      totalCount,
    };
  } catch (err) {
    console.error("Failed to get paginated saved queries:", err);
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

export const deleteAllSavedQueries = async (): Promise<void> => {
  try {
    await dexieDb.savedQueriesTable.clear();
  } catch (err) {
    console.error("Failed to delete all saved queries:", err);
    throw err;
  }
};
