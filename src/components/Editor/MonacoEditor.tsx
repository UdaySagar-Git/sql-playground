import { Editor } from "@monaco-editor/react";
import styles from "./editor.module.css";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MonacoEditor = ({ value, onChange }: MonacoEditorProps) => {
  return (
    <div className={styles.editorContainer}>
      <Editor
        height="100%"
        defaultLanguage="sql"
        theme="vs-dark"
        value={value}
        onChange={(value) => onChange(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
        }}
      />
    </div>
  );
}; 