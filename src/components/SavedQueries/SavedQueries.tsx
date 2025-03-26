import styles from "./savedQueries.module.css";
import { Query } from "@/_mock/mockData";

interface SavedQueriesProps {
  queries: Query[];
  onQuerySelect: (query: string) => void;
}

export const SavedQueries = ({ queries, onQuerySelect }: SavedQueriesProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Saved Queries</h2>
      <div className={styles.list}>
        {queries.map((query) => (
          <button
            key={query.id}
            className={styles.queryItem}
            onClick={() => onQuerySelect(query.sql)}
          >
            <div className={styles.queryText}>{query.sql}</div>
            <div className={styles.timestamp}>
              {query.timestamp.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 