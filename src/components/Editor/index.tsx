import { lazy, Suspense, useCallback } from 'react';
import styles from "./editor.module.css";
import { useCurrentQuery } from "@/api/useQueryEditor";
import { useTabs } from "@/api/useQueryTabs";
import { useExecuteQuery } from "@/api/useQueryOperations";
import { toast } from "sonner";
import { editor } from 'monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const MonacoEditorLazy = lazy(() => import("@monaco-editor/react").then(
  module => ({ default: module.Editor })
));

export const MonacoEditor = () => {
  const { data: currentQuery = "" } = useCurrentQuery();
  const { updateCurrentTabQuery, currentTab } = useTabs();
  const executeQueryMutation = useExecuteQuery();

  const handleRunQuery = useCallback(async () => {
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
  }, [currentQuery, currentTab, executeQueryMutation]);

  const handleEditorDidMount = useCallback((editorInstance: editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) => {
    editorInstance.addCommand(monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter, handleRunQuery);
  }, [handleRunQuery]);

  return (
    <div className={styles.editorContainer}>
      <Suspense fallback={<div className={styles.loading}>Loading editor...</div>}>
        <MonacoEditorLazy
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={currentQuery}
          onChange={(val) => updateCurrentTabQuery(val || "")}
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