import styles from "./savedQueries.module.css";
import { SavedQuery as SavedQueryType } from "@/types";
import { Edit2, Trash2, Check, X } from "lucide-react";
import { useState } from "react";

interface SavedQueriesProps {
  queries: SavedQueryType[];
  onQuerySelect: (query: string) => void;
  onQueryUpdate: (id: string, displayName: string | undefined) => void;
  onQueryDelete: (id: string) => void;
}

export const SavedQueries = ({
  queries,
  onQuerySelect,
  onQueryUpdate,
  onQueryDelete
}: SavedQueriesProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Queries</h2>
      <div className={styles.list}>
        {queries.map((query) => (
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
        ))}
      </div>
    </div>
  );
}; 