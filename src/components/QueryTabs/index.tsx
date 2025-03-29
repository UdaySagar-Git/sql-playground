import { Tab } from "@/types";
import styles from "./queryTabs.module.css";
import { X, Plus, Play, Save, Trash2 } from "lucide-react";

interface QueryTabsProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
  onRunQuery: () => void;
  onSaveQuery: () => void;
  onClear: () => void;
}

export const QueryTabs = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onNewTab,
  onRunQuery,
  onSaveQuery,
  onClear,
}: QueryTabsProps) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.tab} ${activeTabId === tab.id ? styles.activeTab : ""}`}
          >
            <button
              className={styles.tabButton}
              onClick={() => onTabSelect(tab.id)}
            >
              {tab.name}
            </button>
            <button
              className={styles.closeButton}
              onClick={() => onTabClose(tab.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button className={styles.addTabButton} onClick={onNewTab}>
          <Plus size={14} />
        </button>
      </div>
      <div className={styles.actionButtons}>
        <button className={styles.runButton} onClick={onRunQuery}>
          <Play size={14} className={styles.runIcon} />
          Run
        </button>
        <button className={styles.iconButton} onClick={onSaveQuery} title="Save Query">
          <Save size={16} />
        </button>
        <button className={styles.iconButton} onClick={onClear} title="Clear">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}; 