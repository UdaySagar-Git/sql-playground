import styles from "./common.module.css";

interface ListContainerProps {
  isLoading: boolean;
  isEmpty: boolean;
  emptyMessage: string;
  children: React.ReactNode;
}

export const ListContainer = ({
  isLoading,
  isEmpty,
  emptyMessage,
  children,
}: ListContainerProps) => {
  return (
    <div>
      {isLoading ? (
        <div className={styles.loading}>Loading...</div>
      ) : isEmpty ? (
        <div className={styles.emptyState}>
          {emptyMessage}
        </div>
      ) : (
        <div className={styles.list}>
          {children}
        </div>
      )}
    </div>
  );
}; 