import { QueryHistory, PaginatedResponse, PaginationParams } from "@/types";
import { dexieDb } from "@/lib/dexie";

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

export const getPaginatedQueryHistory = async (
  params: PaginationParams
): Promise<PaginatedResponse<QueryHistory>> => {
  try {
    const { limit, cursor, searchTerm } = params;

    let query = dexieDb.queryHistoryTable.orderBy("timestamp").reverse();

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      query = query.filter((item) => item.sql.toLowerCase().includes(term));
    }

    const totalCountPromise =
      searchTerm && searchTerm.trim()
        ? query.clone().count()
        : dexieDb.queryHistoryTable.count();

    if (cursor) {
      const cursorItem = await dexieDb.queryHistoryTable.get(cursor);
      if (cursorItem) {
        query = query.filter((item) => item.timestamp < cursorItem.timestamp);
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
    console.error("Failed to get paginated query history:", err);
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
