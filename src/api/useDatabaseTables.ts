import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTables,
  initializeSQLService,
  getTablesFromDB,
} from "@/actions/tableActions";
import { QUERY_KEYS } from "@/lib/constants";
import { executeQuery } from "@/actions/queryExecutionActions";
import { Table } from "@/types";

export function useTables() {
  return useQuery<Table[]>({
    queryKey: [QUERY_KEYS.TABLES],
    queryFn: getTables,
  });
}

export function useRefreshTables() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return getTablesFromDB();
    },
    onSuccess: (tables) => {
      queryClient.setQueryData([QUERY_KEYS.TABLES], tables);
    },
  });
}

export function useInitializeSQL() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: initializeSQLService,
    onSuccess: (success) => {
      if (success) {
        const tables = getTablesFromDB();
        queryClient.setQueryData([QUERY_KEYS.TABLES], tables);
      }
    },
  });
}

export function useTableQuery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tableName,
      columnName,
    }: {
      tableName: string;
      columnName?: string;
    }) => {
      const sql = columnName
        ? `SELECT ${columnName} FROM ${tableName};`
        : `SELECT * FROM ${tableName};`;
      return executeQuery(sql);
    },
    onSuccess: (results) => {
      queryClient.setQueryData([QUERY_KEYS.QUERY_RESULTS], results[0]);
    },
  });
}
