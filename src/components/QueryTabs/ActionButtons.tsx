import { Play, Save, Trash2 } from "lucide-react";
import styles from "./queryTabs.module.css";

interface ActionButtonsProps {
  onRunQuery: () => void;
  onSaveQuery: () => void;
  onClear: () => void;
  isRunning: boolean;
  isSaving: boolean;
}

export const ActionButtons = ({
  onRunQuery,
  onSaveQuery,
  onClear,
  isRunning,
  isSaving,
}: ActionButtonsProps) => {
  const modKey = navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl';

  return (
    <div className={styles.actionButtons}>
      <button
        className={`${styles.runButton} ${isRunning ? styles.loading : ''}`}
        onClick={onRunQuery}
        disabled={isRunning}
        title={`Run Query (${modKey}+Enter)`}
      >
        <Play size={14} className={styles.runIcon} />
        {isRunning ? 'Running...' : 'Run'}
      </button>
      <button
        className={styles.iconButton}
        onClick={onSaveQuery}
        title="Save Query"
        disabled={isSaving}
      >
        <Save size={16} />
      </button>
      <button className={styles.iconButton} onClick={onClear} title="Clear">
        <Trash2 size={16} />
      </button>
    </div>
  );
}; 