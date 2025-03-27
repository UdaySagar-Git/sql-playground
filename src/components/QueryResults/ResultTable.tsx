import styles from "./resultTable.module.css";
import { ResultRow, Column } from "@/types";

interface ResultTableProps {
  data: ResultRow[];
  columns: Column[];
}

export const ResultTable = ({ data, columns }: ResultTableProps) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.name}>
                <div className={styles.columnName}>{column.name}</div>
                <div className={styles.columnType}>{column.type}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.name}>{row[column.name]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 