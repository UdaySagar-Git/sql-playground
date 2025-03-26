"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { TableList } from "@/components/TableList/TableList";
import { MonacoEditor } from "@/components/Editor/MonacoEditor";
import { QueryHistory } from "@/components/QueryHistory/QueryHistory";
import { ResultTable } from "@/components/QueryResults/ResultTable";
import { SavedQueries } from "@/components/SavedQueries/SavedQueries";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { mockTables, mockQueries, mockResults } from "@/_mock/mockData";
import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState("");

  const handleTableSelect = (tableName: string) => {
    setCurrentQuery(`SELECT * FROM ${tableName};`);
  };

  const handleQuerySelect = (query: string) => {
    setCurrentQuery(query);
  };

  return (
    <div className={styles.page}>
      <ThemeToggle />
      <PanelGroup direction="horizontal" className={styles.panelGroup}>
        <Panel defaultSize={20} minSize={15} className={styles.panel}>
          <PanelGroup direction="vertical" className={styles.leftPanelGroup}>
            <Panel defaultSize={60} minSize={30} className={styles.leftPanel}>
              <TableList tables={mockTables} onTableSelect={handleTableSelect} />
            </Panel>
            <PanelResizeHandle className={styles.leftResizeHandle} />
            <Panel defaultSize={40} minSize={20} className={styles.leftPanel}>
              <SavedQueries queries={mockQueries} onQuerySelect={handleQuerySelect} />
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel defaultSize={60} minSize={30} className={styles.panel}>
          <div className={styles.editorContainer}>
            <div className={styles.editorControls}>
              <button className={styles.button}>Run Query</button>
              <button className={styles.button}>Clear</button>
            </div>
            <PanelGroup direction="vertical" className={styles.editorPanelGroup}>
              <Panel defaultSize={60} minSize={30} className={styles.editorPanel}>
                <MonacoEditor value={currentQuery} onChange={setCurrentQuery} />
              </Panel>
              <PanelResizeHandle className={styles.editorResizeHandle} />
              <Panel defaultSize={40} minSize={20} className={styles.resultPanel}>
                <ResultTable data={mockResults} columns={mockTables[0].columns} />
              </Panel>
            </PanelGroup>
          </div>
        </Panel>
        <PanelResizeHandle className={styles.resizeHandle} />
        <Panel defaultSize={20} minSize={15} className={styles.panel}>
          <QueryHistory queries={mockQueries} onQuerySelect={handleQuerySelect} />
        </Panel>
      </PanelGroup>
    </div>
  );
}
