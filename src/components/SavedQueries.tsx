import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useSavedQueries, useUpdateQuery, useDeleteQuery } from "@/api/useQueryOperations";
import { useTabs } from "@/api/useQueryTabs";
import { ListHeader } from "./common/ListHeader";
import { SearchInput } from "./common/SearchInput";
import { ListContainer } from "./common/ListContainer";
import { ListItem } from "./common/ListItem";

export const SavedQueries = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: queries = [], isLoading } = useSavedQueries();
  const updateQueryMutation = useUpdateQuery();
  const deleteQueryMutation = useDeleteQuery();
  const { updateCurrentTabQuery } = useTabs();

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
    if (queries.length === 0) return;

    try {
      const deletePromises = queries.map(query => deleteQueryMutation.mutateAsync(query.id));
      await Promise.all(deletePromises);
      toast.success("All saved queries cleared");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to clear saved queries";
      toast.error(errorMessage);
    }
  }, [queries, deleteQueryMutation]);

  const handleQuerySelect = useCallback((sql: string) => {
    updateCurrentTabQuery(sql);
    toast.success("Query loaded");
  }, [updateCurrentTabQuery]);

  const filteredQueries = useMemo(() => {
    if (!searchTerm.trim()) return queries;

    const term = searchTerm.toLowerCase();
    return queries.filter(query =>
      (query.displayName && query.displayName.toLowerCase().includes(term)) ||
      query.sql.toLowerCase().includes(term)
    );
  }, [queries, searchTerm]);

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

  return (
    <div className="sql-panel">
      <ListHeader
        title="Saved Queries"
        itemCount={queries.length}
        onClearAll={handleClearAll}
        isClearing={deleteQueryMutation.isPending}
      />

      <SearchInput
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search queries..."
      />

      <ListContainer
        isLoading={isLoading}
        isEmpty={filteredQueries.length === 0}
        emptyMessage={queries.length === 0 ? "No saved queries" : `No queries matching "${searchTerm}"`}
      >
        {filteredQueries.map((query) => (
          <ListItem
            key={query.id}
            id={query.id}
            title={query.displayName || query.sql}
            subtitle={query.timestamp.toLocaleTimeString('en-US', {
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