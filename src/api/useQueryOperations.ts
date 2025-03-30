import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  saveQuery,
  updateQuery,
  deleteQuery,
  getPaginatedSavedQueries,
  deleteAllSavedQueries,
} from "@/actions/queryActions";
import { executeQuery } from "@/actions/queryExecutionActions";
import {
  saveQueryHistory,
  getPaginatedQueryHistory,
} from "@/actions/queryHistoryActions";
import {
  SavedQuery,
  QueryHistory,
  QueryResult,
  PaginationParams,
} from "@/types";
import { QUERY_KEYS } from "@/lib/constants";
import { generateId } from "@/lib/utils";

export function useInfiniteSavedQueries(
  limit: number = 10,
  searchTerm: string = ""
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SAVED_QUERIES, "infinite", limit, searchTerm],
    queryFn: ({ pageParam }) => {
      const params: PaginationParams = {
        limit,
        cursor: pageParam as string | null,
        searchTerm: searchTerm.trim() ? searchTerm : undefined,
      };
      return getPaginatedSavedQueries(params);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useSaveQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (query: SavedQuery) => saveQuery(query),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_QUERIES] });
    },
  });
}

export function useUpdateQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      displayName,
    }: {
      id: string;
      displayName: string | undefined;
    }) => updateQuery(id, displayName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_QUERIES] });
    },
  });
}

export function useDeleteQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQuery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_QUERIES] });
    },
  });
}

export function useDeleteAllSavedQueries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllSavedQueries(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAVED_QUERIES] });
    },
  });
}

export function useInfiniteQueryHistory(
  limit: number = 10,
  searchTerm: string = ""
) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.QUERY_HISTORY, "infinite", limit, searchTerm],
    queryFn: ({ pageParam }) => {
      const params: PaginationParams = {
        limit,
        cursor: pageParam as string | null,
        searchTerm: searchTerm.trim() ? searchTerm : undefined,
      };
      return getPaginatedQueryHistory(params);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useSaveQueryHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (history: QueryHistory) => saveQueryHistory(history),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUERY_HISTORY] });
    },
  });
}

export function useExecuteQuery() {
  const queryClient = useQueryClient();
  const saveHistoryMutation = useSaveQueryHistory();

  return useMutation({
    mutationFn: (sql: string) => executeQuery(sql),
    onSuccess: (results, sql) => {
      if (results.length > 0) {
        queryClient.setQueryData([QUERY_KEYS.QUERY_RESULTS], results[0]);
      } else {
        queryClient.setQueryData([QUERY_KEYS.QUERY_RESULTS], {
          columns: [],
          values: [],
          executionTime: 0,
        });
      }

      const shouldRevalidateTables = results.some(
        (result) => result.shouldRevalidateTables
      );

      if (shouldRevalidateTables) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TABLES] });
      }

      if (sql.trim()) {
        saveHistoryMutation.mutate({
          id: generateId(),
          sql,
          timestamp: new Date(),
        });
      }
    },
  });
}

export function useQueryResults() {
  return useQuery<QueryResult>({
    queryKey: [QUERY_KEYS.QUERY_RESULTS],
    enabled: false,
  });
}
