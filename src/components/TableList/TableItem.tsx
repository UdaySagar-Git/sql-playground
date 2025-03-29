import { ChevronDown, ChevronRight } from "lucide-react";
import styles from "./tableList.module.css";
import { ColumnList } from "./ColumnList";
import { Column } from "@/types";

interface TableItemProps {
  name: string;
  columns: Column[];
  isExpanded: boolean;
  onToggle: () => void;
  onTableClick: (e: React.MouseEvent, tableName: string) => void;
  onColumnClick: (e: React.MouseEvent, tableName: string, columnName: string) => void;
}

export const TableItem = ({
  name,
  columns,
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
          {name}
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