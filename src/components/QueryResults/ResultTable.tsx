import styles from "./resultTable.module.css";
import { ResultRow, Column } from "@/_mock/mockData";

interface ResultTableProps {
  data: ResultRow[];
  columns: Column[];
}

export const ResultTable = ({ data, columns }: ResultTableProps) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        {columns.map((column) => (
          <div key={column.name} className={styles.headerCell}>
            <div className={styles.columnName}>{column.name}</div>
            <div className={styles.columnType}>{column.type}</div>
          </div>
        ))}
      </div>
      <div className={styles.tableBody}>
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.tableRow}>
            {columns.map((column) => (
              <div key={column.name} className={styles.cell}>
                {row[column.name]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 