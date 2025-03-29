import { Plus, Play, Save, Trash2, X } from "lucide-react";
import styles from "./queryTabs.module.css";
import { useTabs } from "@/api/useTabs";
import { useExecuteQuery, useSaveQuery } from "@/api/useQueries";
import { useCurrentQuery } from "@/api/useCurrentQuery";
import { toast } from "sonner";

export const QueryTabs = () => {
  const {
    tabs,
    activeTabId,
    currentTab,
    handleTabSelect,
    handleTabClose,
    handleNewTab,
    updateCurrentTabQuery
  } = useTabs();

  const { data: currentQuery = "" } = useCurrentQuery();
  const executeQueryMutation = useExecuteQuery();
  const saveQueryMutation = useSaveQuery();

  const handleRunQuery = async () => {
    const queryToExecute = currentTab?.query || currentQuery || "";

    if (!queryToExecute) {
      toast.error("Please enter a query before executing.");
      return;
    }

    try {
      await executeQueryMutation.mutateAsync(queryToExecute);
      toast.success("Query executed successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while executing the query";
      toast.error(errorMessage);
    }
  };

  const handleSaveQuery = async () => {
    const queryToSave = currentTab?.query || currentQuery || "";

    if (!queryToSave) {
      toast.error("Please enter a query before saving.");
      return;
    }

    try {
      const newQuery = {
        id: Date.now().toString(),
        sql: queryToSave,
        timestamp: new Date()
      };

      await saveQueryMutation.mutateAsync(newQuery);
      toast.success("Query saved successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save query";
      toast.error(errorMessage);
    }
  };

  const handleClear = () => {
    updateCurrentTabQuery("");
    toast.success("Editor cleared");
  };

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
              onClick={() => handleTabSelect(tab.id)}
            >
              {tab.name}
            </button>
            <button
              className={styles.closeButton}
              onClick={() => handleTabClose(tab.id)}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button className={styles.addTabButton} onClick={handleNewTab}>
          <Plus size={14} />
        </button>
      </div>
      <div className={styles.actionButtons}>
        <button
          className={`${styles.runButton} ${executeQueryMutation.isPending ? styles.loading : ''}`}
          onClick={handleRunQuery}
          disabled={executeQueryMutation.isPending}
        >
          <Play size={14} className={styles.runIcon} />
          {executeQueryMutation.isPending ? 'Running...' : 'Run'}
        </button>
        <button
          className={styles.iconButton}
          onClick={handleSaveQuery}
          title="Save Query"
          disabled={saveQueryMutation.isPending}
        >
          <Save size={16} />
        </button>
        <button className={styles.iconButton} onClick={handleClear} title="Clear">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}; 