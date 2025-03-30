import { ChevronDown, ChevronRight } from "lucide-react";
import styles from "./tableList.module.css";
import { ColumnList } from "./ColumnList";
import { Column } from "@/types";

interface TableItemProps {
  name: string;
  columns: Column[];
  rowCount?: number;
  isExpanded: boolean;
  onToggle: () => void;
  onTableClick: (e: React.MouseEvent, tableName: string) => void;
  onColumnClick: (e: React.MouseEvent, tableName: string, columnName: string) => void;
}

export const TableItem = ({
  name,
  columns,
  rowCount = 0,
  isExpanded,
  onToggle,
  onTableClick,
  onColumnClick,
}: TableItemProps) => {
  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableHeader} onClick={onToggle}>
        {isExpanded ? (
          <ChevronDown className={styles.chevron} />
        ) : (
          <ChevronRight className={styles.chevron} />
        )}
        <button
          className={styles.tableItem}
          onClick={(e) => onTableClick(e, name)}
        >
          <span className={styles.tableName}>{name}</span>
          <span className={styles.rowCount}>({rowCount} rows)</span>
        </button>
      </div>
      {isExpanded && (
        <ColumnList
          columns={columns}
          tableName={name}
          onColumnClick={onColumnClick}
        />
      )}
    </div>
  );
}; 