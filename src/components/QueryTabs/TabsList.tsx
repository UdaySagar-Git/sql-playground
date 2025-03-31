import { Plus } from "lucide-react";
import styles from "./queryTabs.module.css";
import { TabItem } from "./TabItem";
import { Tab } from "@/types";

interface TabsListProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onNewTab: () => void;
}

export const TabsList = ({ tabs, activeTabId, onTabSelect, onTabClose, onNewTab }: TabsListProps) => {
  return (
    <div className={styles.tabsList}>
      {tabs.map((tab, index) => (
        <TabItem
          key={tab.id}
          id={tab.id}
          name={`Query ${index + 1}`}
          isActive={activeTabId === tab.id}
          onSelect={onTabSelect}
          onClose={onTabClose}
        />
      ))}
      <button
        className={styles.addTabButton}
        onClick={onNewTab}
        aria-label="Add new query tab"
      >
        <Plus size={14} aria-hidden="true" />
      </button>
    </div>
  );
};