import styles from "./queryTabs.module.css";
import {
  useTabs,
  useActiveTabId,
  useSetActiveTab,
  useCurrentTab,
  useUpdateTab,
  useDeleteTab,
  useCreateTab
} from "@/api/useQueryTabs";
import { useExecuteQuery, useSaveQuery } from "@/api/useQueryOperations";
import { toast } from "sonner";
import { TabsList } from "./TabsList";
import { ActionButtons } from "./ActionButtons";
import { generateId } from "@/lib/utils";

export const QueryTabs = () => {
  const { data: tabs = [] } = useTabs();
  const activeTabId = useActiveTabId();
  const currentTab = useCurrentTab();
  const setActiveTab = useSetActiveTab();
  const deleteTab = useDeleteTab();
  const createTab = useCreateTab();
  const updateTab = useUpdateTab();

  const executeQueryMutation = useExecuteQuery();
  const saveQueryMutation = useSaveQuery();

  const handleRunQuery = async () => {
    const queryToExecute = currentTab?.query || "";

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
    const queryToSave = currentTab?.query || "";

    if (!queryToSave) {
      toast.error("Please enter a query before saving.");
      return;
    }

    try {
      const newQuery = {
        id: generateId(),
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
    updateTab("");
    toast.success("Editor cleared");
  };

  return (
    <div className={styles.tabsContainer}>
      <TabsList
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSelect={setActiveTab}
        onTabClose={deleteTab}
        onNewTab={createTab}
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