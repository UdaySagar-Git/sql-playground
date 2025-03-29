import styles from "./tableList.module.css";
import { Column } from "@/types";

interface ColumnListProps {
  columns: Column[];
  tableName: string;
  onColumnClick: (e: React.MouseEvent, tableName: string, columnName: string) => void;
}

export const ColumnList = ({ columns, tableName, onColumnClick }: ColumnListProps) => {
  return (
    <div className={styles.columnsList}>
      {columns.map((column) => (
        <div
          key={column.name}
          className={styles.columnItem}
          onClick={(e) => onColumnClick(e, tableName, column.name)}
        >
          <span className={styles.columnName}>{column.name}</span>
          <span className={styles.columnType}>{column.type}</span>
        </div>
      ))}
    </div>
  );
}; 