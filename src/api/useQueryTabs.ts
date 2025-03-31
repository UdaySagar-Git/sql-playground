import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tab } from "@/types";
import { QUERY_KEYS } from "@/lib/constants";
import {
  useTabsStorage,
  createNewTab,
} from "@/actions/queryTabsActions";

export function useTabs() {
  const { tabs, setTabs } = useTabsStorage();

  const { data } = useQuery<Tab[]>({
    queryKey: [QUERY_KEYS.TABS],
    initialData: tabs,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      setTabs(data);
    }
  }, [data, setTabs]);

  return { data };
}

export function useActiveTabId() {
  const { activeTabId, setActiveTabId } = useTabsStorage();

  const { data } = useQuery<string>({
    queryKey: [QUERY_KEYS.CURRENT_TAB_ID],
    initialData: activeTabId,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data) {
      setActiveTabId(data);
    }
  }, [data, setActiveTabId]);

  return data || activeTabId;
}

export function useSetActiveTab() {
  const queryClient = useQueryClient();
  const { setActiveTabId } = useTabsStorage();

  return useCallback(
    (id: string) => {
      queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], id);
      setActiveTabId(id);
    },
    [queryClient, setActiveTabId]
  );
}

export function useCurrentTab() {
  const activeTabId = useActiveTabId();
  const { tabs } = useTabsStorage();
  const { data: queryTabs = [] } = useQuery<Tab[]>({
    queryKey: [QUERY_KEYS.TABS],
    initialData: tabs,
    staleTime: Infinity,
  });

  return queryTabs.find((tab) => tab.id === activeTabId);
}

export function useUpdateTab() {
  const queryClient = useQueryClient();
  const { setTabs } = useTabsStorage();

  return useCallback(
    (query: string) => {
      const currentTabs =
        queryClient.getQueryData<Tab[]>([QUERY_KEYS.TABS]) || [];
      const activeTabId = queryClient.getQueryData<string>([
        QUERY_KEYS.CURRENT_TAB_ID,
      ]);

      if (!activeTabId) return;

      const updatedTabs = currentTabs.map((tab) =>
        tab.id === activeTabId ? { ...tab, query } : tab
      );

      queryClient.setQueryData([QUERY_KEYS.TABS], updatedTabs);
      setTabs(updatedTabs);
    },
    [queryClient, setTabs]
  );
}

export function useDeleteTab() {
  const queryClient = useQueryClient();
  const { setTabs, setActiveTabId } = useTabsStorage();

  return useCallback(
    (id: string) => {
      const currentTabs = queryClient.getQueryData<Tab[]>([QUERY_KEYS.TABS]) || [];
      const newTabs = currentTabs.filter((tab) => tab.id !== id);
      
      queryClient.setQueryData([QUERY_KEYS.TABS], newTabs);
      setTabs(newTabs);

      if (newTabs.length > 0) {
        queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], newTabs[0].id);
        setActiveTabId(newTabs[0].id);
      } else {
        queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], "");
        setActiveTabId("");
      }
    },
    [queryClient, setTabs, setActiveTabId]
  );
}

export function useCreateTab() {
  const queryClient = useQueryClient();
  const { setTabs, setActiveTabId } = useTabsStorage();

  return useCallback(() => {
    const currentTabs =
      queryClient.getQueryData<Tab[]>([QUERY_KEYS.TABS]) || [];
    const newTab = createNewTab();

    const updatedTabs = [...currentTabs, newTab];
    queryClient.setQueryData([QUERY_KEYS.TABS], updatedTabs);
    queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], newTab.id);
    setTabs(updatedTabs);
    setActiveTabId(newTab.id);
  }, [queryClient, setTabs, setActiveTabId]);
}
