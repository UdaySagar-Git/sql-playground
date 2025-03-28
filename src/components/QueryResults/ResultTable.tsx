import styles from "./resultTable.module.css";
import { QueryResult } from "@/types";

export const ResultTable = ({ data }: { data: QueryResult | null; }) => {
  if (!data || !data.columns || !data.values) {
    return <div className={styles.noResults}>No results to display</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th key={column}>
                <div className={styles.columnName}>{column}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.values.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => (
                <td key={`${rowIndex}-${colIndex}`}>{value ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 