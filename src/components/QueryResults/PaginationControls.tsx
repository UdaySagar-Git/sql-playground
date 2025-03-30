import styles from "./queryResults.module.css";
import { useCallback, useState, useEffect } from "react";
import { QueryResult, PaginationSettings } from "@/types";
import { useMobile } from "@/hooks/useMobile";

const CUSTOM_PAGE_SIZE_OPTION = "custom";

interface PaginationControlsProps {
  pagination: PaginationSettings;
  setPagination: (value: React.SetStateAction<PaginationSettings>) => void;
  results: QueryResult;
  startIndex: number;
  endIndex: number;
  totalPages: number;
  pageSizeOptions: number[];
  onExportCSV: () => void;
}

export const PaginationControls = ({
  pagination,
  setPagination,
  results,
  startIndex,
  endIndex,
  totalPages,
  pageSizeOptions,
  onExportCSV,
}: PaginationControlsProps) => {
  const [isCustomPageSize, setIsCustomPageSize] = useState<boolean>(
    !pageSizeOptions.includes(pagination.pageSize)
  );

  const [customPageSizeInput, setCustomPageSizeInput] = useState<string>(
    isCustomPageSize ? pagination.pageSize.toString() : ""
  );

  const isMobile = useMobile();

  useEffect(() => {
    setIsCustomPageSize(!pageSizeOptions.includes(pagination.pageSize));
    if (!pageSizeOptions.includes(pagination.pageSize)) {
      setCustomPageSizeInput(pagination.pageSize.toString());
    }
  }, [pagination.pageSize, pageSizeOptions]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPagination((prev) => ({
        ...prev,
        currentPage: Math.max(1, Math.min(newPage, totalPages)),
      }));
    },
    [totalPages, setPagination]
  );

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;

      if (value === CUSTOM_PAGE_SIZE_OPTION) {
        setIsCustomPageSize(true);
        return;
      }

      setIsCustomPageSize(false);
      const newPageSize = parseInt(value, 10);

      setPagination((prev) => ({
        ...prev,
        pageSize: newPageSize,
        currentPage: 1,
      }));
    },
    [setPagination]
  );

  const handleCustomPageSizeInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomPageSizeInput(e.target.value);
    },
    []
  );

  const applyCustomPageSize = useCallback(() => {
    const newPageSize = parseInt(customPageSizeInput, 10);
    if (!isNaN(newPageSize) && newPageSize > 0) {
      setPagination((prev) => ({
        ...prev,
        pageSize: newPageSize,
        currentPage: 1,
      }));
    }
  }, [customPageSizeInput, setPagination]);

  const handleCustomPageSizeKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        applyCustomPageSize();
      }
    },
    [applyCustomPageSize]
  );

  const handlePageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === "") return;

      const pageNumber = parseInt(inputValue, 10);
      if (isNaN(pageNumber)) return;

      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setPagination((prev) => ({
          ...prev,
          currentPage: pageNumber,
        }));
      }
    },
    [totalPages, setPagination]
  );

  const getSelectValue = () => {
    return pageSizeOptions.includes(pagination.pageSize)
      ? pagination.pageSize.toString()
      : CUSTOM_PAGE_SIZE_OPTION;
  };

  if (isMobile) {
    return (
      <div className={styles.paginationControlsMobile}>
        <div className={styles.paginationRowInfo}>
          <span>
            {startIndex + 1}-{endIndex}/{pagination.totalRows}
          </span>
        </div>

        <div className={styles.mobilePageNav}>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            &lsaquo;
          </button>

          <select
            value={pagination.currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
            className={styles.mobilePageSelect}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>

          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages || totalPages === 0}
          >
            &rsaquo;
          </button>
        </div>

        <div className={styles.mobileActions}>
          <select
            value={getSelectValue()}
            onChange={handlePageSizeChange}
            className={styles.mobileRowsSelect}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <button
            className={styles.mobileExportButton}
            onClick={onExportCSV}
          >
            CSV
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.paginationControls}>
      <div className={styles.paginationInfo}>
        <div>
          <span>Showing {startIndex + 1}-{endIndex} of {pagination.totalRows} rows</span>
        </div>
        {results.executionTime && (
          <div className={styles.executionTime}>
            Execution time: {results.executionTime.toFixed(2)}ms
          </div>
        )}
      </div>

      <div className={styles.paginationActions}>
        <div className={styles.pageSizeSelector}>
          <label htmlFor="pageSize">Rows per page:</label>
          <select
            id="pageSize"
            value={getSelectValue()}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
            <option value={CUSTOM_PAGE_SIZE_OPTION}>Custom</option>
          </select>

          {isCustomPageSize && (
            <div className={styles.customPageSizeContainer}>
              <input
                type="number"
                min="1"
                value={customPageSizeInput}
                onChange={handleCustomPageSizeInputChange}
                onKeyDown={handleCustomPageSizeKeyDown}
                className={styles.customPageSizeInput}
                placeholder="Enter rows"
              />
              <button
                className={styles.customPageSizeButton}
                onClick={applyCustomPageSize}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        <div className={styles.pageNavigation}>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(1)}
            disabled={pagination.currentPage === 1}
          >
            &laquo;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            &lsaquo;
          </button>

          <div className={styles.pageInputContainer}>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={pagination.currentPage}
              onChange={handlePageInputChange}
              className={styles.pageInput}
            />
            <span className={styles.pageSeparator}>/</span>
            <span className={styles.totalPages}>{totalPages}</span>
          </div>

          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages || totalPages === 0}
          >
            &rsaquo;
          </button>
          <button
            className={styles.pageButton}
            onClick={() => handlePageChange(totalPages)}
            disabled={pagination.currentPage === totalPages || totalPages === 0}
          >
            &raquo;
          </button>
        </div>

        <button
          className={styles.exportButton}
          onClick={onExportCSV}
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}; 