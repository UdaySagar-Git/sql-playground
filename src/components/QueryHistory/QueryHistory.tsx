import styles from "./history.module.css";

interface Query {
  id: string;
  sql: string;
  timestamp: Date;
}

interface QueryHistoryProps {
  queries: Query[];
  onQuerySelect: (query: string) => void;
}

export const QueryHistory = ({ queries, onQuerySelect }: QueryHistoryProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Query History</h2>
      <div className={styles.list}>
        {queries.map((query) => (
          <button
            key={query.id}
            className={styles.queryItem}
            onClick={() => onQuerySelect(query.sql)}
          >
            <div className={styles.queryText}>{query.sql}</div>
            <div className={styles.timestamp}>
              {query.timestamp.toLocaleTimeString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 