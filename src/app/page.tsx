"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TableList } from "@/components/TableList/TableList";
import { MonacoEditor } from "@/components/Editor/MonacoEditor";
import { QueryHistory } from "@/components/QueryHistory/QueryHistory";
import { ResultTable } from "@/components/QueryResults/ResultTable";
import { SavedQueries } from "@/components/SavedQueries/SavedQueries";
import { QueryTabs } from "@/components/QueryTabs/QueryTabs";
import { Header } from "@/components/Header/Header";
import { mockTables, mockQueries, mockResults } from "@/mock";
import { useState } from "react";
import styles from "./page.module.css";
import { useMobile } from "@/hooks/useMobile";
import { Tab } from "@/types";

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", name: "Query 1", query: "" }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>("1");
  const [selectedTable, setSelectedTable] = useState(mockTables[0]);
  const [savedQueries, setSavedQueries] = useState(mockQueries);
  const isMobile = useMobile();
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);

  const handleTableSelect = (tableName: string) => {
    const table = mockTables.find(t => t.name === tableName);
    if (table) {
      setSelectedTable(table);
      updateCurrentTabQuery(`SELECT * FROM ${tableName};`);
      if (isMobile) setShowLeftPanel(false);
    }
  };

  const handleColumnSelect = (tableName: string, columnName: string) => {
    updateCurrentTabQuery(`SELECT ${columnName} FROM ${tableName};`);
    if (isMobile) setShowLeftPanel(false);
  };

  const handleQuerySelect = (query: string) => {
    updateCurrentTabQuery(query);
    if (isMobile) setShowRightPanel(false);
  };

  const handleQueryUpdate = (id: string, displayName: string | undefined) => {
    setSavedQueries(prev =>
      prev.map(query =>
        query.id === id
          ? { ...query, displayName }
          : query
      )
    );
  };

  const handleQueryDelete = (id: string) => {
    setSavedQueries(prev => prev.filter(query => query.id !== id));
  };

  const updateCurrentTabQuery = (query: string) => {
    setTabs(prev =>
      prev.map(tab =>
        tab.id === activeTabId
          ? { ...tab, query }
          : tab
      )
    );
  };

  const handleTabSelect = (id: string) => {
    setActiveTabId(id);
  };

  const handleTabClose = (id: string) => {
    setTabs(prev => {
      const newTabs = prev.filter(tab => tab.id !== id);
      if (newTabs.length === 0) {
        const newTab = { id: Date.now().toString(), name: "Query 1", query: "" };
        setActiveTabId(newTab.id);
        return [newTab];
      }
      if (id === activeTabId) {
        setActiveTabId(newTabs[0].id);
      }
      return newTabs;
    });
  };

  const handleNewTab = () => {
    const newTab = {
      id: Date.now().toString(),
      name: `Query ${tabs.length + 1}`,
      query: ""
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleSaveQuery = () => {
    const currentTab = tabs.find(tab => tab.id === activeTabId);
    if (currentTab) {
      if (currentTab.query === "") {
        alert("Please enter a query before saving.");
        return;
      }
      const newQuery = {
        id: Date.now().toString(),
        sql: currentTab.query,
        timestamp: new Date()
      };
      setSavedQueries(prev => [...prev, newQuery]);
    }
  };

  const handleRunQuery = () => {
    // TODO: pending
    console.log(currentTab?.query);
  };

  const handleClear = () => {
    updateCurrentTabQuery("");
  };

  const currentTab = tabs.find(tab => tab.id === activeTabId);

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
              <TableList
                tables={mockTables}
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
                <ResultTable data={mockResults} columns={selectedTable.columns} />
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
          <QueryHistory queries={mockQueries} onQuerySelect={handleQuerySelect} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
