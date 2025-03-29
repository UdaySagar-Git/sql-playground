import styles from "./savedQueries.module.css";
import { SavedQuery as SavedQueryType } from "@/types";
import { Edit2, Trash2, Check, X, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface SavedQueriesProps {
  queries: SavedQueryType[];
  onQuerySelect: (query: string) => void;
  onQueryUpdate: (id: string, displayName: string | undefined) => void;
  onQueryDelete: (id: string) => void;
  onClearAll: () => void;
}

export const SavedQueries = ({
  queries,
  onQuerySelect,
  onQueryUpdate,
  onQueryDelete,
  onClearAll
}: SavedQueriesProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQueries = useMemo(() => {
    if (!searchTerm.trim()) return queries;

    const term = searchTerm.toLowerCase();
    return queries.filter(query =>
      (query.displayName && query.displayName.toLowerCase().includes(term)) ||
      query.sql.toLowerCase().includes(term)
    );
  }, [queries, searchTerm]);

  const handleEditStart = (query: SavedQueryType) => {
    setEditingId(query.id);
    setEditValue(query.displayName || "");
  };

  const handleEditSave = () => {
    if (editingId) {
      onQueryUpdate(editingId, editValue.trim() || undefined);
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

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
            onClick={onClearAll}
            title="Clear all saved queries"
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
        {filteredQueries.length === 0 ? (
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
                    onClick={() => onQuerySelect(query.sql)}
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
                      onClick={() => handleEditStart(query)}
                      title="Edit name"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      className={styles.iconButton}
                      onClick={() => onQueryDelete(query.id)}
                      title="Delete query"
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