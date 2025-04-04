import { lazy, Suspense, useCallback } from 'react';
import styles from "./editor.module.css";
import { useCurrentTab, useUpdateTab } from "@/api/useQueryTabs";
import { useExecuteQuery } from "@/api/useQueryOperations";
import { toast } from "sonner";
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useTheme } from 'next-themes';
import { Loading } from '@/components/common/Loading';

const MonacoEditorLazy = lazy(() => import("@monaco-editor/react").then(
  module => ({ default: module.Editor })
));

export const MonacoEditor = () => {
  const updateTab = useUpdateTab();
  const currentTab = useCurrentTab();
  const executeQueryMutation = useExecuteQuery();
  const { theme } = useTheme();

  const handleRunQuery = useCallback(async () => {
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
  }, [currentTab, executeQueryMutation]);

  const handleEditorDidMount = useCallback((editorInstance: editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    editorInstance.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter, handleRunQuery);
  }, [handleRunQuery]);

  if (!currentTab) {
    return <div className={styles.noTabSelected}>
      <div className={styles.noTabContent}>
        <p>No query tab selected</p>
        <p className={styles.noTabSubtext}>Create a new tab to get started</p>
      </div>
    </div>;
  }

  return (
    <div className={styles.editorContainer}>
      <Suspense fallback={
        <div className={styles.loadingWrapper}>
          <Loading text="Loading editor..." />
        </div>
      }>
        <MonacoEditorLazy
          height="100%"
          defaultLanguage="sql"
          theme={theme === "light" ? "vs" : "vs-dark"}
          value={currentTab?.query || ""}
          onChange={(val) => updateTab(val || "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
          }}
        />
      </Suspense>
    </div>
  );
}; 