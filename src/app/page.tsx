"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TableList } from "@/components/TableList";
import { MonacoEditor } from "@/components/Editor";
import { QueryHistory } from "@/components/QueryHistory";
import { QueryResults } from "@/components/QueryResults";
import { SavedQueries } from "@/components/SavedQueries";
import { QueryTabs } from "@/components/QueryTabs";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { usePanelState } from "@/providers/PanelProvider";
import { initializeSQLService } from "@/actions/tables";
import { queryClient, QUERY_KEYS } from "@/lib/queryClient";
import { resetDB } from "@/lib/sql";

export default function Home() {
  const [initError, setInitError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const { showLeftPanel, showRightPanel } = usePanelState();

  useEffect(() => {
    const initSQL = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);

        const success = await initializeSQLService();

        if (!success) {
          setInitError(`Failed to initialize SQL service`);
        } else {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
        }
      } catch (err) {
        setInitError(err instanceof Error ? err.message : "Failed to initialize application");
      } finally {
        setIsInitializing(false);
      }
    };

    initSQL();
  }, [retryCount]);

  const handleRetry = () => {
    resetDB();
    setRetryCount(prev => prev + 1);
  };

  if (initError) {
    return (
      <div className={styles.errorContainer}>
        <h2>Failed to Initialize Application</h2>
        <p>{initError}</p>
        <button onClick={handleRetry}>Retry Initialization</button>
        <p className={styles.errorHelp}>
          If the problem persists, please try reloading the page or clearing your browser cache.
        </p>
      </div>
    );
  }

  if (isInitializing) {
    return <div className={styles.loading}>Initializing application...</div>;
  }

  return (
    <div className={styles.page}>
      <PanelGroup direction="horizontal" className={styles.panelGroup}>
        <Panel
          defaultSize={20}
          minSize={15}
          className={`${styles.panel} ${showLeftPanel ? styles.active : ''}`}
        >
          <PanelGroup direction="vertical" className={styles.leftPanelGroup}>
            <Panel defaultSize={60} minSize={30} className={styles.leftPanel}>
              <TableList />
            </Panel>
            <PanelResizeHandle className={styles.leftResizeHandle} />
            <Panel defaultSize={40} minSize={20} className={styles.leftPanel}>
              <SavedQueries />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel defaultSize={60} minSize={30} className={styles.panel}>
          <div className={styles.editorContainer}>
            <QueryTabs />
            <PanelGroup direction="vertical" className={styles.editorPanelGroup}>
              <Panel defaultSize={60} minSize={30} className={styles.editorPanel}>
                <MonacoEditor />
              </Panel>
              <PanelResizeHandle className={styles.editorResizeHandle} />
              <Panel defaultSize={40} minSize={20} className={styles.resultPanel}>
                <QueryResults />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel
          defaultSize={20}
          minSize={15}
          className={`${styles.panel} ${showRightPanel ? styles.active : ''}`}
        >
          <QueryHistory />
        </Panel>
      </PanelGroup>
    </div>
  );
}
