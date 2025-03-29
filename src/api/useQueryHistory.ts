import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteQueryHistory,
  deleteAllQueryHistory,
} from "@/actions/queryHistoryActions";
import { QUERY_KEYS } from "@/lib/constants";

export function useDeleteQueryHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteQueryHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUERY_HISTORY] });
    },
  });
}

export function useDeleteAllQueryHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAllQueryHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUERY_HISTORY] });
    },
  });
}
