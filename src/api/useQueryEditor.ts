import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";

export function useCurrentQuery() {
  return useQuery<string>({
    queryKey: [QUERY_KEYS.CURRENT_QUERY],
    initialData: "select * from customers",
  });
}

export function useSetCurrentQuery() {
  const queryClient = useQueryClient();

  return (query: string) => {
    queryClient.setQueryData([QUERY_KEYS.CURRENT_QUERY], query);
  };
}
