import styles from "./tableList.module.css";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Table } from "@/types";

interface TableListProps {
  tables: Table[];
  onTableSelect: (tableName: string) => void;
  onColumnSelect: (tableName: string, columnName: string) => void;
}

export const TableList = ({ tables, onTableSelect, onColumnSelect }: TableListProps) => {
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tables</h2>
      <div className={styles.list}>
        {tables.map((table) => (
          <div key={table.name} className={styles.tableWrapper}>
            <div className={styles.tableHeader} onClick={() => toggleTable(table.name)}>
              {expandedTables.has(table.name) ? (
                <ChevronDown className={styles.chevron} />
              ) : (
                <ChevronRight className={styles.chevron} />
              )}
              <button
                className={styles.tableItem}
                onClick={(e) => {
                  e.stopPropagation();
                  onTableSelect(table.name);
                }}
              >
                {table.name}
              </button>
            </div>
            {expandedTables.has(table.name) && (
              <div className={styles.columnsList}>
                {table.columns.map((column) => (
                  <div
                    key={column.name}
                    className={styles.columnItem}
                    onClick={() => onColumnSelect(table.name, column.name)}
                  >
                    <span className={styles.columnName}>{column.name}</span>
                    <span className={styles.columnType}>{column.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 