import { useRef, useEffect } from "react";
import React from "react";
import { Virtuoso } from "react-virtuoso";
import styles from "./common.module.css";
import { PaginationInfo } from "./PaginationInfo";

interface ListContainerProps {
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
  maxHeight?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  loadMoreLabel?: string;
  currentCount?: number;
  totalCount?: number;
  showPaginationInfo?: boolean;
}

export const ListContainer = ({
  isLoading,
  isEmpty,
  emptyMessage,
  children,
  maxHeight,
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  loadMoreLabel = "Loading more...",
  currentCount,
  totalCount,
  showPaginationInfo = true
}: ListContainerProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const childrenArray = React.Children.toArray(children);

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    if (loadMoreRef.current && hasNextPage && fetchNextPage) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 }
      );

      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreRef, hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className={styles.containerWrapper}>
      {showPaginationInfo && typeof currentCount === 'number' && currentCount > 0 && (
        <div className={styles.paginationInfoSmall}>
          <PaginationInfo
            currentCount={currentCount}
            totalCount={totalCount}
            isLoading={isLoading}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      )}

      <div className={styles.listWrapper} style={maxHeight ? { maxHeight } : { flex: 1 }}>
        {isLoading && !isFetchingNextPage ? (
          <div className={styles.loading}>Loading...</div>
        ) : isEmpty ? (
          <div className={styles.emptyState}>
            {emptyMessage}
          </div>
        ) : (
          <Virtuoso
            data={childrenArray}
            totalCount={childrenArray.length}
            style={{ height: '100%', width: '100%' }}
            endReached={handleEndReached}
            itemContent={(index) => (
              <div className={styles.virtuosoItem}>
                {childrenArray[index]}
              </div>
            )}
            components={{
              Footer: hasNextPage && isFetchingNextPage ? () => (
                <div className={styles["load-more-indicator"]}>
                  <span>{loadMoreLabel}</span>
                </div>
              ) : undefined
            }}
          />
        )}
      </div>
    </div>
  );
};