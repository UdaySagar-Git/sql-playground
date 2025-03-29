import styles from "./queryResults.module.css";
import { useRef } from "react";
import { useQueryResults } from "@/api/useQueries";
import { SqlValue } from "sql.js";

export const QueryResults = () => {
  const { data: results } = useQueryResults();
  const containerRef = useRef<HTMLDivElement>(null);

  if (!results) {
    return <div className={styles.noResults}>No results to display</div>;
  }

  return (
    <div className={styles.tableContainer} ref={containerRef}>
      <table className={styles.table}>
        <thead>
          <tr>
            {results.columns.map((column: string) => (
              <th key={column} title={column}>
                <div className={styles.columnName}>{column}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.values.map((row: SqlValue[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((value: SqlValue, colIndex: number) => {
                const displayValue = value ?? "";
                return (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    title={typeof displayValue === 'string' ? displayValue : String(displayValue)}
                  >
                    {displayValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 