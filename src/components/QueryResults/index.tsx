import styles from "./queryResults.module.css";
import { useRef, useState, useEffect } from "react";
import { useQueryResults } from "@/api/useQueryOperations";
import { TableVirtuoso } from "react-virtuoso";
import { SqlValue } from "sql.js";
import { PaginationSettings } from "@/types";
import { PaginationControls } from "./PaginationControls";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const DEFAULT_PAGE_SIZE = 10;

export const QueryResults = () => {
  const { data: results } = useQueryResults();
  const containerRef = useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = useState<PaginationSettings>({
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalRows: 0,
  });

  useEffect(() => {
    if (results) {
      setPagination(prev => ({
        ...prev,
        totalRows: results.values.length,
        currentPage: 1,
      }));
    }
  }, [results]);

  const totalPages = Math.ceil(pagination.totalRows / pagination.pageSize);
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const endIndex = Math.min(startIndex + pagination.pageSize, pagination.totalRows);

  const exportToCSV = () => {
    if (!results) return;

    const csvContent = [
      results.columns.join(','),
      ...results.values.map(row =>
        row.map(value => {
          const stringValue = value === null ? '' : String(value);
          return stringValue.includes(',') || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'query_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!results) {
    return <div className={styles.noResults}>No results to display</div>;
  }

  if (results.values.length === 0) {
    return <div className={styles.noResults}>Query executed successfully, but returned no rows</div>;
  }

  const currentPageData = results.values.slice(startIndex, endIndex);

  return (
    <div className={styles.queryResultsContainer}>
      <div className={styles.tableContainer} ref={containerRef}>
        <TableVirtuoso
          style={{ height: "100%", width: "100%" }}
          data={currentPageData}
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
                    title={String(displayValue)}
                  >
                    {displayValue}
                  </td>
                );
              })}
            </>
          )}
        />
      </div>

      <PaginationControls
        pagination={pagination}
        setPagination={setPagination}
        results={results}
        startIndex={startIndex}
        endIndex={endIndex}
        totalPages={totalPages}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onExportCSV={exportToCSV}
      />
    </div>
  );
};