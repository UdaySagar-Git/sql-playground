import { lazy, Suspense } from 'react';
import styles from "./editor.module.css";
import { useCurrentQuery } from "@/api/useQueryEditor";
import { useTabs } from "@/api/useQueryTabs";

const MonacoEditorLazy = lazy(() => import("@monaco-editor/react").then(
  module => ({ default: module.Editor })
));

export const MonacoEditor = () => {
  const { data: currentQuery = "" } = useCurrentQuery();
  const { updateCurrentTabQuery } = useTabs();

  return (
    <div className={styles.editorContainer}>
      <Suspense fallback={<div className={styles.loading}>Loading editor...</div>}>
        <MonacoEditorLazy
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={currentQuery}
          onChange={(val) => updateCurrentTabQuery(val || "")}
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