import styles from "./queryResults.module.css";
import { useRef } from "react";
import { useQueryResults } from "@/api/useQueryOperations";
import { TableVirtuoso } from "react-virtuoso";
import { SqlValue } from "sql.js";

export const QueryResults = () => {
  const { data: results } = useQueryResults();
  const containerRef = useRef<HTMLDivElement>(null);

  if (!results) {
    return <div className={styles.noResults}>No results to display</div>;
  }

  return (
    <div className={styles.tableContainer} ref={containerRef}>
      <TableVirtuoso
        style={{ height: "100%", width: "100%" }}
        data={results.values}
        components={{
          Table: ({ style, ...props }) => (
            <table
              {...props}
              style={{ ...style }}
              className={styles.table}
            />
          ),
          TableRow: ({ ...props }) => <tr {...props} />,
          TableHead: ({ ...props }) => (
            <thead {...props} className={styles.tableHead} />
          ),
        }}
        fixedHeaderContent={() => (
          <tr>
            {results.columns.map((column: string) => (
              <th
                key={column}
                className={styles.headerCell}
                title={column}
              >
                {column}
              </th>
            ))}
          </tr>
        )}
        itemContent={(index, row) => (
          <>
            {row.map((value: SqlValue, colIndex: number) => {
              const displayValue = value ?? "";
              return (
                <td
                  key={`${index}-${colIndex}`}
                  className={styles.cell}
                  title={typeof displayValue === 'string' ? displayValue : String(displayValue)}
                >
                  {displayValue}
                </td>
              );
            })}
          </>
        )}
      />
    </div>
  );
}; 