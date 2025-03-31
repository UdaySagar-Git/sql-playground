import { RefreshCw } from "lucide-react";
import styles from "./tableList.module.css";

interface TableHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const TableHeader = ({ onRefresh, isRefreshing }: TableHeaderProps) => {
  return (
    <div className={styles.header}>
      <h2 className={styles.title}>Tables</h2>
      <button
        className={styles.refreshButton}
        onClick={onRefresh}
        title="Refresh tables list"
        aria-label={isRefreshing ? "Refreshing tables list" : "Refresh tables list"}
        disabled={isRefreshing}
      >
        <RefreshCw className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`} aria-hidden="true" />
      </button>
    </div>
  );
}; 