import styles from "./queryTabs.module.css";
import { useTabs } from "@/api/useQueryTabs";
import { useExecuteQuery, useSaveQuery } from "@/api/useQueryOperations";
import { useCurrentQuery } from "@/api/useQueryEditor";
import { toast } from "sonner";
import { TabsList } from "./TabsList";
import { ActionButtons } from "./ActionButtons";

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
      <TabsList
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={handleTabSelect}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />
      <ActionButtons
        onRunQuery={handleRunQuery}
        onSaveQuery={handleSaveQuery}
        onClear={handleClear}
        isRunning={executeQueryMutation.isPending}
        isSaving={saveQueryMutation.isPending}
      />
    </div>
  );
}; 