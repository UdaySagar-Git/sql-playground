import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useInfiniteQueryHistory } from "@/api/useQueryOperations";
import { useDeleteQueryHistory, useDeleteAllQueryHistory, useUpdateQueryHistory } from "@/api/useQueryHistory";
import { useUpdateTab } from "@/api/useQueryTabs";
import { useDebounce } from "@/hooks/useDebounce";
import { ListHeader } from "./common/ListHeader";
import { SearchInput } from "./common/SearchInput";
import { ListContainer } from "./common/ListContainer";
import { ListItem } from "./common/ListItem";
import { formatDate } from "@/lib/utils";
import styles from "./common/common.module.css";

const ITEMS_PER_PAGE = 15;

export const QueryHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const {
    data: historyData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQueryHistory(ITEMS_PER_PAGE, debouncedSearchTerm);

  const deleteHistoryMutation = useDeleteQueryHistory();
  const deleteAllHistoryMutation = useDeleteAllQueryHistory();
  const updateHistoryMutation = useUpdateQueryHistory();
  const updateTab = useUpdateTab();

  const handleQueryDelete = useCallback(async (id: string) => {
    try {
      await deleteHistoryMutation.mutateAsync(id);
      toast.success("Query history item deleted");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete query history";
      toast.error(errorMessage);
    }
  }, [deleteHistoryMutation]);

  const handleClearAll = useCallback(async () => {
    try {
      await deleteAllHistoryMutation.mutateAsync();
      toast.success("Query history cleared");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear query history";
      toast.error(errorMessage);
    }
  }, [deleteAllHistoryMutation]);

  const handleSelectQuery = useCallback((sql: string) => {
    updateTab(sql);
    toast.success("Query loaded from history");
  }, [updateTab]);

  const handleQueryUpdate = useCallback(async (id: string, displayName: string | undefined) => {
    try {
      await updateHistoryMutation.mutateAsync({ id, displayName });
      toast.success("Query history item updated");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update query history";
      toast.error(errorMessage);
    }
  }, [updateHistoryMutation]);

  const handleEditStart = useCallback((id: string, displayName?: string) => {
    setEditingId(id);
    setEditValue(displayName || "");
  }, []);

  const handleEditSave = useCallback(() => {
    if (editingId) {
      handleQueryUpdate(editingId, editValue.trim() || undefined);
      setEditingId(null);
    }
  }, [editingId, editValue, handleQueryUpdate]);

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  const displayedQueries = useMemo(() => {
    return historyData?.pages.flatMap(page => page.data) || [];
  }, [historyData]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const totalCount = useMemo(() => {
    if (!historyData?.pages || historyData.pages.length === 0) return 0;
    return historyData.pages[0].totalCount || 0;
  }, [historyData]);

  return (
    <div className={`sql-panel ${styles.panelContainer}`} style={{ maxHeight: '100%', overflow: 'hidden' }}>
      <ListHeader
        title="Query History"
        itemCount={totalCount}
        onClearAll={handleClearAll}
        isClearing={deleteAllHistoryMutation.isPending}
      />

      <div>
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search history..."
        />
      </div>

      <ListContainer
        isLoading={isLoading}
        isEmpty={displayedQueries.length === 0}
        emptyMessage={debouncedSearchTerm ? `No history matching "${debouncedSearchTerm}"` : "No query history"}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        loadMoreLabel="Loading more history..."
        currentCount={displayedQueries.length}
        totalCount={totalCount}
        showPaginationInfo={true}
      >
        {displayedQueries.map((query) => (
          <ListItem
            key={query.id}
            id={query.id}
            title={query.displayName || query.sql}
            subtitle={formatDate(query.timestamp)}
            isEditing={editingId === query.id}
            editValue={editValue}
            onEditValueChange={setEditValue}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onSelect={() => handleSelectQuery(query.sql)}
            onDelete={handleQueryDelete}
            isUpdating={updateHistoryMutation.isPending}
            isDeleting={deleteHistoryMutation.isPending}
            showEditButton={true}
          />
        ))}
      </ListContainer>
    </div>
  );
}; 