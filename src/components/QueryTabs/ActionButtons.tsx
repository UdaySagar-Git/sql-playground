import { Play, Save, Trash2 } from "lucide-react";
import styles from "./queryTabs.module.css";
import { usePlatform } from "@/hooks/usePlatform";

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
  const platform = usePlatform();
  const modKey = platform === 'mac' ? '⌘' : 'Ctrl';

  return (
    <div className={styles.actionButtons}>
      <button
        className={`${styles.runButton} ${isRunning ? styles.loading : ''}`}
        onClick={onRunQuery}
        disabled={isRunning}
        title={`Run Query (${modKey}+Enter)`}
        aria-label={`Run Query (${modKey}+Enter)`}
      >
        <Play size={14} className={styles.runIcon} aria-hidden="true" />
        {isRunning ? 'Running...' : 'Run'}
      </button>
      <button
        className={styles.iconButton}
        onClick={onSaveQuery}
        title="Save Query"
        aria-label="Save Query"
        disabled={isSaving}
      >
        <Save size={16} aria-hidden="true" />
      </button>
      <button
        className={styles.iconButton}
        onClick={onClear}
        title="Clear Query"
        aria-label="Clear Query"
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </div>
  );
}; 