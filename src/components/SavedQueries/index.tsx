import styles from "./savedQueries.module.css";
import { Edit2, Trash2, Check, X, Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useSavedQueries, useUpdateQuery, useDeleteQuery } from "@/api/useQueries";
import { useTabs } from "@/api/useTabs";

export const SavedQueries = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: queries = [], isLoading } = useSavedQueries();
  const updateQueryMutation = useUpdateQuery();
  const deleteQueryMutation = useDeleteQuery();
  const { updateCurrentTabQuery } = useTabs();

  const handleQueryUpdate = useCallback(async (id: string, displayName: string | undefined) => {
    try {
      await updateQueryMutation.mutateAsync({ id, displayName });
      toast.success("Query updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update query";
      toast.error(errorMessage);
    }
  }, [updateQueryMutation]);

  const handleQueryDelete = useCallback(async (id: string) => {
    try {
      await deleteQueryMutation.mutateAsync(id);
      toast.success("Query deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete query";
      toast.error(errorMessage);
    }
  }, [deleteQueryMutation]);

  const handleClearAll = useCallback(async () => {
    if (queries.length === 0) return;

    try {
      const deletePromises = queries.map(query => deleteQueryMutation.mutateAsync(query.id));
      await Promise.all(deletePromises);
      toast.success("All saved queries cleared");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear saved queries";
      toast.error(errorMessage);
    }
  }, [queries, deleteQueryMutation]);

  const handleQuerySelect = useCallback((sql: string) => {
    updateCurrentTabQuery(sql);
    toast.success("Query loaded");
  }, [updateCurrentTabQuery]);

  const filteredQueries = useMemo(() => {
    if (!searchTerm.trim()) return queries;

    const term = searchTerm.toLowerCase();
    return queries.filter(query =>
      (query.displayName && query.displayName.toLowerCase().includes(term)) ||
      query.sql.toLowerCase().includes(term)
    );
  }, [queries, searchTerm]);

  const handleEditStart = useCallback((id: string, displayName?: string) => {
    setEditingId(id);
    setEditValue(displayName || "");
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingId) {
      handleQueryUpdate(editingId, editValue.trim() || undefined);
      setEditingId(null);
    }
  }, [editingId, editValue, handleQueryUpdate]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Saved Queries</h2>
        {queries.length > 0 && (
          <button
            className={styles.clearAllButton}
            onClick={handleClearAll}
            title="Clear all saved queries"
            disabled={deleteQueryMutation.isPending}
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
            placeholder="Search queries..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className={styles.list}>
        {isLoading ? (
          <div className={styles.loading}>Loading saved queries...</div>
        ) : filteredQueries.length === 0 ? (
          <div className={styles.emptyState}>
            {queries.length === 0
              ? "No saved queries"
              : `No queries matching "${searchTerm}"`}
          </div>
        ) : (
          filteredQueries.map((query) => (
            <div key={query.id} className={styles.queryItem}>
              {editingId === query.id ? (
                <div className={styles.editContainer}>
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className={styles.editInput}
                    placeholder="Enter display name (optional)"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave();
                      if (e.key === "Escape") handleEditCancel();
                    }}
                  />
                  <div className={styles.editActions}>
                    <button
                      className={styles.iconButton}
                      onClick={handleEditSave}
                      title="Save"
                      disabled={updateQueryMutation.isPending}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={handleEditCancel}
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    className={styles.queryButton}
                    onClick={() => handleQuerySelect(query.sql)}
                  >
                    <div className={styles.queryText}>
                      {query.displayName || query.sql}
                    </div>
                    <div className={styles.timestamp}>
                      {query.timestamp.toLocaleTimeString('en-US', {
                        hour12: false,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                  </button>
                  <div className={styles.actions}>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleEditStart(query.id, query.displayName)}
                      title="Edit name"
                      disabled={updateQueryMutation.isPending}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleQueryDelete(query.id)}
                      title="Delete query"
                      disabled={deleteQueryMutation.isPending}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}; 