"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TableList } from "@/components/TableList";
import { MonacoEditor } from "@/components/Editor";
import { QueryHistory } from "@/components/QueryHistory";
import { QueryResults } from "@/components/QueryResults";
import { SavedQueries } from "@/components/SavedQueries";
import { QueryTabs } from "@/components/QueryTabs";
import { useState, useEffect, Suspense } from "react";
import styles from "./page.module.css";
import { usePanelState } from "@/providers/PanelProvider";
import { initializeSQLService } from "@/actions/tableActions";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/constants";
import { resetDB, getDB } from "@/lib/sql";
import { Loading } from "@/components/common/Loading";

function LoadingFallback() {
  return <Loading text="Loading..." />;
}

export default function Home() {
  const [initError, setInitError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { showLeftPanel, showRightPanel } = usePanelState();

  useEffect(() => {
    let isMounted = true;

    const checkAndInitialize = async () => {
      try {
        setInitError(null);

        // fallback 
        if (getDB()) {
          const success = await initializeSQLService(true);
          if (!isMounted) return;

          if (!success) {
            setInitError(`Failed to initialize SQL data`);
          } else {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
          }
        } else {
          const success = await initializeSQLService();
          if (!isMounted) return;

          if (!success) {
            setInitError(`Failed to initialize SQL service`);
          } else {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
          }
        }
      } catch (err) {
        if (!isMounted) return;
        setInitError(err instanceof Error ? err.message : "Failed to initialize application");
      }
    };

    checkAndInitialize();

    return () => {
      isMounted = false;
    };
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

  return (
    <div className={styles.page}>
      <PanelGroup direction="horizontal" className={styles.panelGroup}>
        <Panel
          defaultSize={20}
          className={`${styles.panel} ${showLeftPanel ? styles.active : ''}`}
          id="left-panel"
        >
          <PanelGroup direction="vertical" className={styles.leftPanelGroup}>
            <Panel defaultSize={50} minSize={30} className={styles.leftPanel} id="table-list">
              <Suspense fallback={<LoadingFallback />}>
                <TableList />
              </Suspense>
            </Panel>
            <PanelResizeHandle
              className={styles.leftResizeHandle}
              role="separator"
              aria-orientation="horizontal"
              aria-controls="table-list saved-queries"
            />
            <Panel defaultSize={50} minSize={30} className={styles.leftPanel} id="saved-queries">
              <Suspense fallback={<LoadingFallback />}>
                <SavedQueries />
              </Suspense>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle
          className={styles.resizeHandle}
          role="separator"
          aria-orientation="vertical"
          aria-controls="left-panel main-panel"
        />
        <Panel defaultSize={60} minSize={30} className={styles.panel} id="main-panel">
          <div className={styles.editorContainer}>
            <Suspense fallback={<LoadingFallback />}>
              <QueryTabs />
            </Suspense>
            <PanelGroup direction="vertical" className={styles.editorPanelGroup}>
              <Panel defaultSize={50} className={styles.editorPanel} id="editor-panel">
                <Suspense fallback={<LoadingFallback />}>
                  <MonacoEditor />
                </Suspense>
              </Panel>
              <PanelResizeHandle
                className={styles.editorResizeHandle}
                role="separator"
                aria-orientation="horizontal"
                aria-controls="editor-panel result-panel"
              />
              <Panel defaultSize={50} className={styles.resultPanel} id="result-panel">
                <Suspense fallback={<LoadingFallback />}>
                  <QueryResults />
                </Suspense>
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        <PanelResizeHandle
          className={styles.resizeHandle}
          role="separator"
          aria-orientation="vertical"
          aria-controls="main-panel right-panel"
        />
        <Panel
          defaultSize={20}
          className={`${styles.panel} ${showRightPanel ? styles.active : ''}`}
          id="right-panel"
        >
          <Suspense fallback={<LoadingFallback />}>
            <QueryHistory />
          </Suspense>
        </Panel>
      </PanelGroup>
    </div>
  );
}
