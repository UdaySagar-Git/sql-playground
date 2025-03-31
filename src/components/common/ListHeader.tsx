import { useCallback } from "react";
import styles from "./common.module.css";

interface ListHeaderProps {
  title: string;
  itemCount: number;
  onClearAll: () => void;
  isClearing?: boolean;
}

export const ListHeader = ({ title, itemCount, onClearAll, isClearing }: ListHeaderProps) => {
  const handleClearAll = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm(`Are you sure you want to clear all ${title.toLowerCase()}?`)) {
      onClearAll();
    }
  }, [title, onClearAll]);

  return (
    <div className={styles.header}>
      <h2 className={styles.title}>{title}</h2>
      {itemCount > 0 && (
        <button
          className={styles.clearAllButton}
          onClick={handleClearAll}
          title="Clear all"
          disabled={isClearing}
        >
          Clear All
        </button>
      )}
    </div>
  );
}; 