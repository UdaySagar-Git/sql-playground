import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useInfiniteSavedQueries, useUpdateQuery, useDeleteQuery } from "@/api/useQueryOperations";
import { useTabs } from "@/api/useQueryTabs";
import { useDebounce } from "@/hooks/useDebounce";
import { ListHeader } from "./common/ListHeader";
import { SearchInput } from "./common/SearchInput";
import { ListContainer } from "./common/ListContainer";
import { ListItem } from "./common/ListItem";
import styles from "./common/common.module.css";

const ITEMS_PER_PAGE = 10;

export const SavedQueries = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm);

  const {
    data: queriesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteSavedQueries(ITEMS_PER_PAGE, debouncedSearchTerm);

  const updateQueryMutation = useUpdateQuery();
  const deleteQueryMutation = useDeleteQuery();
  const { updateCurrentTabQuery } = useTabs();

  const displayedQueries = useMemo(() => {
    return queriesData?.pages.flatMap(page => page.data) || [];
  }, [queriesData]);

  const handleQueryUpdate = useCallback(async (id: string, displayName: string | undefined) => {
    try {
      await updateQueryMutation.mutateAsync({ id, displayName });
      toast.success("Query updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update query";
      toast.error(errorMessage);
    }
  }, [updateQueryMutation]);

  const handleQueryDelete = useCallback(async (id: string) => {
    try {
      await deleteQueryMutation.mutateAsync(id);
      toast.success("Query deleted successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete query";
      toast.error(errorMessage);
    }
  }, [deleteQueryMutation]);

  const handleClearAll = useCallback(async () => {
    if (displayedQueries.length === 0) return;

    try {
      const deletePromises = displayedQueries.map(query => deleteQueryMutation.mutateAsync(query.id));
      await Promise.all(deletePromises);
      toast.success("All saved queries cleared");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear saved queries";
      toast.error(errorMessage);
    }
  }, [displayedQueries, deleteQueryMutation]);

  const handleQuerySelect = useCallback((sql: string) => {
    updateCurrentTabQuery(sql);
    toast.success("Query loaded");
  }, [updateCurrentTabQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  const totalCount = useMemo(() => {
    if (!queriesData?.pages || queriesData.pages.length === 0) return 0;
    return queriesData.pages[0].totalCount || 0;
  }, [queriesData]);

  return (
    <div className={`sql-panel ${styles.panelContainer}`} style={{ maxHeight: '100%', overflow: 'hidden' }}>
      <ListHeader
        title="Saved Queries"
        itemCount={totalCount}
        onClearAll={handleClearAll}
        isClearing={deleteQueryMutation.isPending}
      />

      <div>
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search queries..."
        />
      </div>

      <ListContainer
        isLoading={isLoading}
        isEmpty={displayedQueries.length === 0}
        emptyMessage={debouncedSearchTerm ? `No queries matching "${debouncedSearchTerm}"` : "No saved queries"}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        loadMoreLabel="Loading more queries..."
        currentCount={displayedQueries.length}
        totalCount={totalCount}
        showPaginationInfo={true}
      >
        {displayedQueries.map((query) => (
          <ListItem
            key={query.id}
            id={query.id}
            title={query.displayName || query.sql}
            subtitle={new Date(query.timestamp).toLocaleTimeString('en-US', {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
            isEditing={editingId === query.id}
            editValue={editValue}
            onEditValueChange={setEditValue}
            onEditStart={handleEditStart}
            onEditSave={handleEditSave}
            onEditCancel={handleEditCancel}
            onSelect={() => handleQuerySelect(query.sql)}
            onDelete={handleQueryDelete}
            isUpdating={updateQueryMutation.isPending}
            isDeleting={deleteQueryMutation.isPending}
            showEditButton={true}
          />
        ))}
      </ListContainer>
    </div>
  );
}; 