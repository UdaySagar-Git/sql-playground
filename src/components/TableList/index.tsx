import styles from "./tableList.module.css";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Table } from "@/types";
import { toast } from "sonner";
import { getTables } from "@/actions/tables";

interface TableListProps {
  onTableSelect: (tableName: string) => void;
  onColumnSelect: (tableName: string, columnName: string) => void;
}

export const TableList = ({ onTableSelect, onColumnSelect }: TableListProps) => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tables = useLiveQuery(
    async () => {
      try {
        return await getTables();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tables");
        return [];
      }
    },
    [],
    []
  );

  const toggleTable = useCallback((tableName: string) => {
    setExpandedTables(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(tableName)) {
        newExpanded.delete(tableName);
      } else {
        newExpanded.add(tableName);
      }
      return newExpanded;
    });
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      await getTables();
      toast.success("Tables refreshed successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh tables";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const handleTableClick = useCallback((e: React.MouseEvent, tableName: string) => {
    e.stopPropagation();
    onTableSelect(tableName);
    toast.success(`Selected table: ${tableName}`);
  }, [onTableSelect]);

  const handleColumnClick = useCallback((tableName: string, columnName: string) => {
    onColumnSelect(tableName, columnName);
    toast.success(`Selected column: ${columnName} from ${tableName}`);
  }, [onColumnSelect]);

  const renderTableColumns = useCallback((table: Table) => (
    <div className={styles.columnsList}>
      {table.columns.map((column) => (
        <div
          key={column.name}
          className={styles.columnItem}
          onClick={() => handleColumnClick(table.name, column.name)}
        >
          <span className={styles.columnName}>{column.name}</span>
          <span className={styles.columnType}>{column.type}</span>
        </div>
      ))}
    </div>
  ), [handleColumnClick]);

  const renderTable = useCallback((table: Table) => (
    <div key={table.name} className={styles.tableWrapper}>
      <div className={styles.tableHeader} onClick={() => toggleTable(table.name)}>
        {expandedTables.has(table.name) ? (
          <ChevronDown className={styles.chevron} />
        ) : (
          <ChevronRight className={styles.chevron} />
        )}
        <button
          className={styles.tableItem}
          onClick={(e) => handleTableClick(e, table.name)}
        >
          {table.name}
        </button>
      </div>
      {expandedTables.has(table.name) && renderTableColumns(table)}
    </div>
  ), [expandedTables, toggleTable, handleTableClick, renderTableColumns]);

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tables</h2>
          <button
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`} />
          </button>
        </div>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Tables</h2>
        <button
          className={styles.refreshButton}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={`${styles.refreshIcon} ${isRefreshing ? styles.spinning : ''}`} />
        </button>
      </div>
      {!tables ? (
        <div className={styles.loading}>Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className={styles.noTables}>No tables available</div>
      ) : (
        <div className={styles.list}>
          {tables.map(renderTable)}
        </div>
      )}
    </div>
  );
}; 