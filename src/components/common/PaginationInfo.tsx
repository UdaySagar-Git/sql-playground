import styles from "./common.module.css";

interface PaginationInfoProps {
  currentCount: number;
  totalCount?: number;
  isLoading: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export const PaginationInfo = ({
  currentCount,
  totalCount,
  isLoading,
  hasNextPage = false,
  isFetchingNextPage = false
}: PaginationInfoProps) => {
  const displayTotalCount = totalCount !== undefined
    ? totalCount
    : (hasNextPage ? `${currentCount}+` : currentCount);

  if (isLoading && !isFetchingNextPage) {
    return <div className={styles.paginationInfo}>Loading items...</div>;
  }

  if (isFetchingNextPage) {
    return (
      <div className={styles.paginationInfo}>
        <strong>Showing {currentCount} of {displayTotalCount} items</strong>
        <span className={styles.loadingDots}></span>
      </div>
    );
  }

  return (
    <div className={styles.paginationInfo}>
      <strong>Showing {currentCount} of {displayTotalCount} items</strong>
    </div>
  );
};