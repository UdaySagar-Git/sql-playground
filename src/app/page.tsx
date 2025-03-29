"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TableList } from "@/components/TableList";
import { MonacoEditor } from "@/components/Editor/MonacoEditor";
import { QueryHistory } from "@/components/QueryHistory";
import { QueryResults } from "@/components/QueryResults";
import { SavedQueries } from "@/components/SavedQueries";
import { QueryTabs } from "@/components/QueryTabs";
import { mockQueries } from "@/mock";
import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { Tab, QueryResult, SavedQuery, QueryHistory as QueryHistoryItem } from "@/types";
import { toast } from "sonner";
import { usePanelState } from "@/providers/PanelProvider";
import { initializeSQLService } from "@/actions/tables";
import { executeQuery, saveQuery, updateQuery, deleteQuery, saveQueryHistory, getSavedQueries, getQueryHistory } from "@/actions/queries";
import { deleteQueryHistory, deleteAllQueryHistory } from "@/actions/queryHistory";

const INITIAL_TAB: Tab = { id: "1", name: "Query 1", query: "" };

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([INITIAL_TAB]);
  const [activeTabId, setActiveTabId] = useState<string>(INITIAL_TAB.id);
  const [savedQueries, setSavedQueries] = useState(mockQueries);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showLeftPanel, showRightPanel, setShowLeftPanel, setShowRightPanel } = usePanelState();
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initSQL = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);
        const success = await initializeSQLService();
        if (success) {
          const [savedQueries, history] = await Promise.all([
            getSavedQueries(),
            getQueryHistory()
          ]);
          setSavedQueries(savedQueries);
          setQueryHistory(history);
        } else {
          setInitError("Failed to initialize SQL service");
        }
      } catch (err) {
        setInitError(err instanceof Error ? err.message : "Failed to initialize application");
      } finally {
        setIsInitializing(false);
      }
    };
    initSQL();
  }, []);

  const updateCurrentTabQuery = useCallback((query: string) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === activeTabId
          ? { ...tab, query }
          : tab
      )
    );
  }, [activeTabId]);

  const handleTableSelect = useCallback((tableName: string) => {
    updateCurrentTabQuery(`SELECT * FROM ${tableName};`);
    setShowLeftPanel(false);
  }, [updateCurrentTabQuery, setShowLeftPanel]);

  const handleColumnSelect = useCallback((tableName: string, columnName: string) => {
    updateCurrentTabQuery(`SELECT ${columnName} FROM ${tableName};`);
    setShowLeftPanel(false);
  }, [updateCurrentTabQuery, setShowLeftPanel]);

  const handleQuerySelect = useCallback((query: string) => {
    updateCurrentTabQuery(query);
    setShowRightPanel(false);
  }, [updateCurrentTabQuery, setShowRightPanel]);

  const handleQueryUpdate = useCallback(async (id: string, displayName: string | undefined) => {
    try {
      await updateQuery(id, displayName);
      setSavedQueries(prev =>
        prev.map(query =>
          query.id === id
            ? { ...query, displayName }
            : query
        )
      );
      toast.success("Query updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update query";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  const handleQueryDelete = useCallback(async (id: string) => {
    try {
      await deleteQuery(id);
      setSavedQueries(prev => prev.filter(q => q.id !== id));
      toast.success("Query deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete query";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  const handleQueryHistoryDelete = useCallback(async (id: string) => {
    try {
      await deleteQueryHistory(id);
      setQueryHistory(prev => prev.filter(q => q.id !== id));
      toast.success("Query history item deleted");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete query history";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  const handleClearAllQueryHistory = useCallback(async () => {
    try {
      await deleteAllQueryHistory();
      setQueryHistory([]);
      toast.success("Query history cleared");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear query history";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, []);

  const handleClearAllSavedQueries = useCallback(async () => {
    try {
      const deletePromises = savedQueries.map(query => deleteQuery(query.id));
      await Promise.all(deletePromises);
      setSavedQueries([]);
      toast.success("All saved queries cleared");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear saved queries";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [savedQueries]);

  const handleTabSelect = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const handleTabClose = useCallback((id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== id);
      if (newTabs.length === 0) {
        const newTab = { ...INITIAL_TAB, id: Date.now().toString() };
        setActiveTabId(newTab.id);
        return [newTab];
      }
      if (id === activeTabId) {
        setActiveTabId(newTabs[0].id);
      }
      return newTabs;
    });
  }, [activeTabId]);

  const handleNewTab = useCallback(() => {
    const newTab = {
      id: Date.now().toString(),
      name: `Query ${tabs.length + 1}`,
      query: ""
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  }, [tabs.length]);

  const handleRunQuery = useCallback(async () => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    if (!currentTab) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!currentTab.query) {
        toast.error("Please enter a query before executing.");
        return;
      }

      const results = await executeQuery(currentTab.query);
      setQueryResults(results[0]);
      const historyEntry: QueryHistoryItem = {
        id: Date.now().toString(),
        sql: currentTab.query,
        timestamp: new Date(),
        results: results[0]
      };
      await saveQueryHistory(historyEntry);
      setQueryHistory(prev => [historyEntry, ...prev]);
      toast.success("Query executed successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while executing the query";
      setError(errorMessage);
      setQueryResults(null);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [activeTabId, tabs]);

  const handleSaveQuery = useCallback(async () => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    if (!currentTab) return;

    if (!currentTab.query) {
      toast.error("Please enter a query before saving.");
      return;
    }

    try {
      const newQuery: SavedQuery = {
        id: Date.now().toString(),
        sql: currentTab.query,
        timestamp: new Date()
      };

      await saveQuery(newQuery);
      setSavedQueries(prev => [...prev, newQuery]);
      toast.success("Query saved successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save query");
      toast.error("Failed to save query");
    }
  }, [activeTabId, tabs]);

  const handleClear = useCallback(() => {
    updateCurrentTabQuery("");
    setQueryResults(null);
    setError(null);
    toast.success("Editor cleared");
  }, [updateCurrentTabQuery]);

  const currentTab = tabs.find(tab => tab.id === activeTabId);

  if (initError) {
    return (
      <div className={styles.errorContainer}>
        <h2>Failed to Initialize Application</h2>
        <p>{initError}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
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
              <TableList
                onTableSelect={handleTableSelect}
                onColumnSelect={handleColumnSelect}
              />
            </Panel>
            <PanelResizeHandle className={styles.leftResizeHandle} />
            <Panel defaultSize={40} minSize={20} className={styles.leftPanel}>
              <SavedQueries
                queries={savedQueries}
                onQuerySelect={handleQuerySelect}
                onQueryUpdate={handleQueryUpdate}
                onQueryDelete={handleQueryDelete}
                onClearAll={handleClearAllSavedQueries}
              />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel defaultSize={60} minSize={30} className={styles.panel}>
          <div className={styles.editorContainer}>
            <QueryTabs
              tabs={tabs}
              activeTabId={activeTabId}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
              onNewTab={handleNewTab}
              onRunQuery={handleRunQuery}
              onSaveQuery={handleSaveQuery}
              onClear={handleClear}
            />
            <PanelGroup direction="vertical" className={styles.editorPanelGroup}>
              <Panel defaultSize={60} minSize={30} className={styles.editorPanel}>
                <MonacoEditor
                  value={currentTab?.query || ""}
                  onChange={updateCurrentTabQuery}
                />
              </Panel>
              <PanelResizeHandle className={styles.editorResizeHandle} />
              <Panel defaultSize={40} minSize={20} className={styles.resultPanel}>
                {isLoading ? (
                  <div className={styles.loading}>Executing query...</div>
                ) : error ? (
                  <div className={styles.error}>{error}</div>
                ) : (
                  <QueryResults data={queryResults} />
                )}
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
          <QueryHistory
            queries={queryHistory}
            onQuerySelect={handleQuerySelect}
            onQueryDelete={handleQueryHistoryDelete}
            onClearAll={handleClearAllQueryHistory}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}
