import styles from "./resultTable.module.css";
import { ResultRow } from "@/_mock/mockData";

interface ResultTableProps {
  data: ResultRow[];
  columns: string[];
}

export const ResultTable = ({ data, columns }: ResultTableProps) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        {columns.map((column) => (
          <div key={column} className={styles.headerCell}>
            {column}
          </div>
        ))}
      </div>
      <div className={styles.tableBody}>
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.tableRow}>
            {columns.map((column) => (
              <div key={column} className={styles.cell}>
                {row[column]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}; 