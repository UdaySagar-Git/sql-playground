import { QueryHistory as QueryHistoryType } from "@/types";
import styles from "./history.module.css";
import { Trash2, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface QueryHistoryProps {
  queries: QueryHistoryType[];
  onQuerySelect: (query: string) => void;
  onQueryDelete: (id: string) => void;
  onClearAll: () => void;
}

export const QueryHistory = ({
  queries,
  onQuerySelect,
  onQueryDelete,
  onClearAll
}: QueryHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQueries = useMemo(() => {
    if (!searchTerm.trim()) return queries;

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
        {queries.length > 0 && (
          <button
            className={styles.clearAllButton}
            onClick={onClearAll}
            title="Clear all history"
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
        {filteredQueries.length === 0 ? (
          <div className={styles.emptyState}>
            {queries.length === 0
              ? "No query history"
              : `No history matching "${searchTerm}"`}
          </div>
        ) : (
          filteredQueries.map((query) => (
            <div key={query.id} className={styles.queryItem}>
              <button
                className={styles.queryButton}
                onClick={() => onQuerySelect(query.sql)}
              >
                <div className={styles.queryText}>{query.sql}</div>
                <div className={styles.timestamp}>
                  {query.timestamp.toLocaleTimeString()}
                </div>
              </button>
              <button
                className={styles.iconButton}
                onClick={() => onQueryDelete(query.id)}
                title="Delete query"
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