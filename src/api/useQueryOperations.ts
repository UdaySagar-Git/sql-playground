import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  saveQuery,
  updateQuery,
  getSavedQueries,
  deleteQuery,
} from "@/actions/queryActions";
import { executeQuery } from "@/actions/queryExecutionActions";
import {
  saveQueryHistory,
  getQueryHistory,
} from "@/actions/queryHistoryActions";
import { SavedQuery, QueryHistory, QueryResult } from "@/types";
import { QUERY_KEYS } from "@/lib/constants";

export function useSavedQueries() {
  return useQuery({
    queryKey: [QUERY_KEYS.SAVED_QUERIES],
    queryFn: getSavedQueries,
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

export function useQueryHistory() {
  return useQuery({
    queryKey: [QUERY_KEYS.QUERY_HISTORY],
    queryFn: getQueryHistory,
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
      queryClient.setQueryData([QUERY_KEYS.QUERY_RESULTS], results[0]);

      if (sql.trim()) {
        saveHistoryMutation.mutate({
          id: Date.now().toString(),
          sql,
          timestamp: new Date(),
          results: results[0],
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
