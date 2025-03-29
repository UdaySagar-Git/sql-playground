import styles from "./queryResults.module.css";
import { QueryResult } from "@/types";

export const QueryResults = ({ data }: { data: QueryResult | null; }) => {
  if (!data || !data.columns || !data.values) {
    return <div className={styles.noResults}>No results to display</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th key={column} title={column}>
                <div className={styles.columnName}>{column}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.values.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((value, colIndex) => {
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