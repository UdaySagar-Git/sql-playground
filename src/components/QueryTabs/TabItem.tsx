import { X } from "lucide-react";
import styles from "./queryTabs.module.css";

interface TabItemProps {
  id: string;
  name: string;
  isActive: boolean;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export const TabItem = ({ id, name, isActive, onSelect, onClose }: TabItemProps) => {
  return (
    <div className={`${styles.tab} ${isActive ? styles.activeTab : ""}`}>
      <button
        className={styles.tabButton}
        onClick={() => onSelect(id)}
        aria-label={`Switch to ${name}`}
      >
        {name}
      </button>
      <button
        className={styles.closeButton}
        onClick={() => onClose(id)}
        aria-label={`Close ${name}`}
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}; 