import styles from "./history.module.css";
import { Trash2, Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useQueryHistory } from "@/api/useQueries";
import { useDeleteQueryHistory, useDeleteAllQueryHistory } from "@/api/useDeleteHistory";
import { useTabs } from "@/api/useTabs";

export const QueryHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: queries, isLoading } = useQueryHistory();
  const deleteHistoryMutation = useDeleteQueryHistory();
  const deleteAllHistoryMutation = useDeleteAllQueryHistory();
  const { updateCurrentTabQuery } = useTabs();

  const handleQueryDelete = useCallback(async (id: string) => {
    try {
      await deleteHistoryMutation.mutateAsync(id);
      toast.success("Query history item deleted");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete query history";
      toast.error(errorMessage);
    }
  }, [deleteHistoryMutation]);

  const handleClearAll = useCallback(async () => {
    try {
      await deleteAllHistoryMutation.mutateAsync();
      toast.success("Query history cleared");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear query history";
      toast.error(errorMessage);
    }
  }, [deleteAllHistoryMutation]);

  const handleSelectQuery = useCallback((sql: string) => {
    updateCurrentTabQuery(sql);
    toast.success("Query loaded from history");
  }, [updateCurrentTabQuery]);

  const filteredQueries = useMemo(() => {
    if (!searchTerm.trim() || !queries) return queries || [];

    const term = searchTerm.toLowerCase();
    return queries.filter(query =>
      query.sql.toLowerCase().includes(term)
    );
  }, [queries, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Query History</h2>
        {queries && queries.length > 0 && (
          <button
            className={styles.clearAllButton}
            onClick={handleClearAll}
            title="Clear all history"
            disabled={deleteAllHistoryMutation.isPending}
          >
            Clear All
          </button>
        )}
      </div>

      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search history..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.loading}>Loading history...</div>
        ) : filteredQueries.length === 0 ? (
          <div className={styles.emptyState}>
            {queries && queries.length === 0
              ? "No query history"
              : `No history matching "${searchTerm}"`}
          </div>
        ) : (
          filteredQueries.map((query) => (
            <div key={query.id} className={styles.queryItem}>
              <button
                className={styles.queryButton}
                onClick={() => handleSelectQuery(query.sql)}
              >
                <div className={styles.queryText}>{query.sql}</div>
                <div className={styles.timestamp}>
                  {query.timestamp.toLocaleTimeString()}
                </div>
              </button>
              <button
                className={styles.iconButton}
                onClick={() => handleQueryDelete(query.id)}
                title="Delete query"
                disabled={deleteHistoryMutation.isPending}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 