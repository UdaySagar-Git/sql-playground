import { Editor } from "@monaco-editor/react";
import styles from "./editor.module.css";
import { useCurrentQuery } from "@/api/useCurrentQuery";
import { useTabs } from "@/api/useTabs";

export const MonacoEditor = () => {
  const { data: currentQuery = "" } = useCurrentQuery();
  const { updateCurrentTabQuery } = useTabs();

  return (
    <div className={styles.editorContainer}>
      <Editor
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
    </div>
  );
}; 