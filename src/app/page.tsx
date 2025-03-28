"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TableList } from "@/components/TableList/TableList";
import { MonacoEditor } from "@/components/Editor/MonacoEditor";
import { QueryHistory } from "@/components/QueryHistory/QueryHistory";
import { ResultTable } from "@/components/QueryResults/ResultTable";
import { SavedQueries } from "@/components/SavedQueries/SavedQueries";
import { QueryTabs } from "@/components/QueryTabs/QueryTabs";
import { Header } from "@/components/Header/Header";
import { mockQueries } from "@/mock";
import { useState, useEffect, useCallback } from "react";
import styles from "./page.module.css";
import { useMobile } from "@/hooks/useMobile";
import { Tab, QueryResult, SavedQuery, QueryHistory as QueryHistoryItem } from "@/types";
import { SQLService } from "@/lib/sql";

const INITIAL_TAB: Tab = { id: "1", name: "Query 1", query: "" };

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([INITIAL_TAB]);
  const [activeTabId, setActiveTabId] = useState<string>(INITIAL_TAB.id);
  const [savedQueries, setSavedQueries] = useState(mockQueries);
  const [queryResults, setQueryResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMobile();
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [sqlService, setSqlService] = useState<SQLService | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    const initSQL = async () => {
      try {
        setIsInitializing(true);
        setInitError(null);
        const service = new SQLService();
        const success = await service.initialize();
        if (success) {
          setSqlService(service);
          const [savedQueries, history] = await Promise.all([
            service.getSavedQueries(),
            service.getQueryHistory()
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
    if (isMobile) setShowLeftPanel(false);
  }, [isMobile, updateCurrentTabQuery]);

  const handleColumnSelect = useCallback((tableName: string, columnName: string) => {
    updateCurrentTabQuery(`SELECT ${columnName} FROM ${tableName};`);
    if (isMobile) setShowLeftPanel(false);
  }, [isMobile, updateCurrentTabQuery]);

  const handleQuerySelect = useCallback((query: string) => {
    updateCurrentTabQuery(query);
    if (isMobile) setShowRightPanel(false);
  }, [isMobile, updateCurrentTabQuery]);

  const handleQueryUpdate = useCallback(async (id: string, displayName: string | undefined) => {
    if (!sqlService) return;

    try {
      await sqlService.updateQuery(id, displayName);
      setSavedQueries(prev =>
        prev.map(query =>
          query.id === id
            ? { ...query, displayName }
            : query
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update query");
    }
  }, [sqlService]);

  const handleQueryDelete = useCallback(async (id: string) => {
    if (!sqlService) return;

    try {
      await sqlService.deleteQuery(id);
      setSavedQueries(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete query");
    }
  }, [sqlService]);

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
    if (!currentTab || !sqlService) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await sqlService.executeQuery(currentTab.query);
      setQueryResults(results[0]);
      const historyEntry: QueryHistoryItem = {
        id: Date.now().toString(),
        sql: currentTab.query,
        timestamp: new Date(),
        results: results[0]
      };
      await sqlService.saveQueryHistory(historyEntry);
      setQueryHistory(prev => [historyEntry, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while executing the query");
      setQueryResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeTabId, tabs, sqlService]);

  const handleSaveQuery = useCallback(async () => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    if (!currentTab || !sqlService) return;

    if (currentTab.query === "") {
      alert("Please enter a query before saving.");
      return;
    }

    try {
      const newQuery: SavedQuery = {
        id: Date.now().toString(),
        sql: currentTab.query,
        timestamp: new Date()
      };

      await sqlService.saveQuery(newQuery);
      setSavedQueries(prev => [...prev, newQuery]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save query");
    }
  }, [activeTabId, tabs, sqlService]);

  const handleClear = useCallback(() => {
    updateCurrentTabQuery("");
    setQueryResults(null);
    setError(null);
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
      <Header
        showLeftPanel={showLeftPanel}
        showRightPanel={showRightPanel}
        onLeftPanelToggle={() => setShowLeftPanel(!showLeftPanel)}
        onRightPanelToggle={() => setShowRightPanel(!showRightPanel)}
      />
      <PanelGroup direction="horizontal" className={styles.panelGroup}>
        <Panel
          defaultSize={20}
          minSize={15}
          className={`${styles.panel} ${showLeftPanel ? styles.active : ''}`}
        >
          <PanelGroup direction="vertical" className={styles.leftPanelGroup}>
            <Panel defaultSize={60} minSize={30} className={styles.leftPanel}>
              {sqlService && (
                <TableList
                  sqlService={sqlService}
                  onTableSelect={handleTableSelect}
                  onColumnSelect={handleColumnSelect}
                />
              )}
            </Panel>
            <PanelResizeHandle className={styles.leftResizeHandle} />
            <Panel defaultSize={40} minSize={20} className={styles.leftPanel}>
              <SavedQueries
                queries={savedQueries}
                onQuerySelect={handleQuerySelect}
                onQueryUpdate={handleQueryUpdate}
                onQueryDelete={handleQueryDelete}
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
                  <ResultTable data={queryResults} />
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
          <QueryHistory queries={queryHistory} onQuerySelect={handleQuerySelect} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
