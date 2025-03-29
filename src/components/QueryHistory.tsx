import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useQueryHistory } from "@/api/useQueryOperations";
import { useDeleteQueryHistory, useDeleteAllQueryHistory } from "@/api/useQueryHistory";
import { useTabs } from "@/api/useQueryTabs";
import { ListHeader } from "./common/ListHeader";
import { SearchInput } from "./common/SearchInput";
import { ListContainer } from "./common/ListContainer";
import { ListItem } from "./common/ListItem";

export const QueryHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: queries, isLoading } = useQueryHistory();
  const deleteHistoryMutation = useDeleteQueryHistory();
  const deleteAllHistoryMutation = useDeleteAllQueryHistory();
  const { updateCurrentTabQuery } = useTabs();

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
    updateCurrentTabQuery(sql);
    toast.success("Query loaded from history");
  }, [updateCurrentTabQuery]);

  const filteredQueries = useMemo(() => {
    if (!searchTerm.trim() || !queries) return queries || [];

    const term = searchTerm.toLowerCase();
    return queries.filter(query =>
      query.sql.toLowerCase().includes(term)
    );
  }, [queries, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="sql-panel">
      <ListHeader
        title="Query History"
        itemCount={queries?.length || 0}
        onClearAll={handleClearAll}
        isClearing={deleteAllHistoryMutation.isPending}
      />

      <SearchInput
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search history..."
      />

      <ListContainer
        isLoading={isLoading}
        isEmpty={filteredQueries.length === 0}
        emptyMessage={queries?.length === 0 ? "No query history" : `No history matching "${searchTerm}"`}
      >
        {filteredQueries.map((query) => (
          <ListItem
            key={query.id}
            id={query.id}
            title={query.sql}
            subtitle={query.timestamp.toLocaleTimeString()}
            onSelect={() => handleSelectQuery(query.sql)}
            onDelete={handleQueryDelete}
            isDeleting={deleteHistoryMutation.isPending}
            showEditButton={false}
          />
        ))}
      </ListContainer>
    </div>
  );
}; 