import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const QUERY_KEYS = {
  SAVED_QUERIES: "savedQueries",
  QUERY_HISTORY: "queryHistory",
  QUERY_RESULTS: "queryResults",
  TABLES: "tables",
  CURRENT_QUERY: "currentQuery",
};