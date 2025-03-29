import styles from "./tableList.module.css";
import { ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTables, useRefreshTables } from "@/api/useTables";
import { queryClient, QUERY_KEYS } from "@/lib/queryClient";

export const TableList = () => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const { data: tables = [], isLoading, isError, error } = useTables();
  const refreshTablesMutation = useRefreshTables();

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
    try {
      await refreshTablesMutation.mutateAsync();
      toast.success("Tables refreshed successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to refresh tables";
      toast.error(errorMessage);
    }
  }, [refreshTablesMutation]);

  const handleTableClick = useCallback((e: React.MouseEvent, tableName: string) => {
    e.stopPropagation();
    queryClient.setQueryData([QUERY_KEYS.CURRENT_QUERY], `SELECT * FROM ${tableName};`);
    toast.success(`Selected table: ${tableName}`);
  }, []);

  const handleColumnClick = useCallback((e: React.MouseEvent, tableName: string, columnName: string) => {
    e.stopPropagation();
    queryClient.setQueryData([QUERY_KEYS.CURRENT_QUERY], `SELECT ${columnName} FROM ${tableName};`);
    toast.success(`Selected column: ${columnName} from ${tableName}`);
  }, []);

  const renderTableColumns = useCallback((table: typeof tables[0]) => (
    <div className={styles.columnsList}>
      {table.columns.map((column) => (
        <div
          key={column.name}
          className={styles.columnItem}
          onClick={(e) => handleColumnClick(e, table.name, column.name)}
        >
          <span className={styles.columnName}>{column.name}</span>
          <span className={styles.columnType}>{column.type}</span>
        </div>
      ))}
    </div>
  ), [handleColumnClick]);

  const renderTable = useCallback((table: typeof tables[0]) => (
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

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Tables</h2>
          <button
            className={styles.refreshButton}
            onClick={handleRefresh}
            disabled={refreshTablesMutation.isPending}
          >
            <RefreshCw className={`${styles.refreshIcon} ${refreshTablesMutation.isPending ? styles.spinning : ''}`} />
          </button>
        </div>
        <div className={styles.error}>{error instanceof Error ? error.message : "Failed to load tables"}</div>
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
          disabled={refreshTablesMutation.isPending}
        >
          <RefreshCw className={`${styles.refreshIcon} ${refreshTablesMutation.isPending ? styles.spinning : ''}`} />
        </button>
      </div>
      {isLoading ? (
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