import styles from "./tableList.module.css";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTables, useRefreshTables } from "@/api/useDatabaseTables";
import { useSetCurrentQuery } from "@/api/useQueryEditor";
import { TableHeader } from "./TableHeader";
import { TableItem } from "./TableItem";

export const TableList = () => {
  const [openTable, setOpenTable] = useState<string | null>(null);
  const { data: tables = [], isLoading, isError, error } = useTables();
  const refreshTablesMutation = useRefreshTables();
  const setCurrentQuery = useSetCurrentQuery();

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
    setCurrentQuery(`SELECT * FROM ${tableName};`);
    toast.success(`Selected table: ${tableName}`);
  }, [setCurrentQuery]);

  const handleColumnClick = useCallback((e: React.MouseEvent, tableName: string, columnName: string) => {
    e.stopPropagation();
    setCurrentQuery(`SELECT ${columnName} FROM ${tableName};`);
    toast.success(`Selected column: ${columnName} from ${tableName}`);
  }, [setCurrentQuery]);

  if (isError) {
    return (
      <div className={styles.container}>
        <TableHeader
          onRefresh={handleRefresh}
          isRefreshing={refreshTablesMutation.isPending}
        />
        <div className={styles.error}>{error instanceof Error ? error.message : "Failed to load tables"}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TableHeader
        onRefresh={handleRefresh}
        isRefreshing={refreshTablesMutation.isPending}
      />
      {isLoading ? (
        <div className={styles.loading}>Loading tables...</div>
      ) : tables.length === 0 ? (
        <div className={styles.noTables}>No tables available</div>
      ) : (
        <div className={styles.list}>
          {tables.map((table) => (
            <TableItem
              key={table.name}
              name={table.name}
              columns={table.columns}
              rowCount={table.rowCount}
              isExpanded={openTable === table.name}
              onToggle={() => setOpenTable(openTable === table.name ? null : table.name)}
              onTableClick={handleTableClick}
              onColumnClick={handleColumnClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 