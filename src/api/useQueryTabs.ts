import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Tab } from "@/types";
import { QUERY_KEYS } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import {
  INITIAL_TABS,
  loadTabsFromStorage,
  saveTabsToStorage,
  loadActiveTabIdFromStorage,
  saveActiveTabIdToStorage,
  createNewTab,
} from "@/actions/queryTabsActions";

export function useTabs() {
  const queryClient = useQueryClient();

  const initialTabs = loadTabsFromStorage();
  if (!queryClient.getQueryData([QUERY_KEYS.TABS])) {
    queryClient.setQueryData([QUERY_KEYS.TABS], initialTabs);

    const activeTabId = loadActiveTabIdFromStorage();
    queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], activeTabId);
  }

  const { data } = useQuery<Tab[]>({
    queryKey: [QUERY_KEYS.TABS],
    initialData: initialTabs,
    staleTime: Infinity,
  });

  if (data) {
    saveTabsToStorage(data);
  }

  return { data };
}

export function useActiveTabId() {
  const initialTabId = loadActiveTabIdFromStorage();

  const { data } = useQuery<string>({
    queryKey: [QUERY_KEYS.CURRENT_TAB_ID],
    initialData: initialTabId,
    staleTime: Infinity,
  });

  if (data) {
    saveActiveTabIdToStorage(data);
  }

  return data || initialTabId;
}

export function useSetActiveTab() {
  const queryClient = useQueryClient();
  return useCallback(
    (id: string) => {
      queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], id);
      saveActiveTabIdToStorage(id);
    },
    [queryClient]
  );
}

export function useCurrentTab() {
  const activeTabId = useActiveTabId();
  const { data: tabs = [] } = useQuery<Tab[]>({
    queryKey: [QUERY_KEYS.TABS],
    initialData: loadTabsFromStorage(),
    staleTime: Infinity,
  });

  return tabs.find((tab) => tab.id === activeTabId) || INITIAL_TABS[0];
}

export function useUpdateTab() {
  const queryClient = useQueryClient();

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
      saveTabsToStorage(updatedTabs);
    },
    [queryClient]
  );
}

export function useDeleteTab() {
  const queryClient = useQueryClient();

  return useCallback(
    (id: string) => {
      const currentTabs =
        queryClient.getQueryData<Tab[]>([QUERY_KEYS.TABS]) || [];
      const activeTabId = queryClient.getQueryData<string>([
        QUERY_KEYS.CURRENT_TAB_ID,
      ]);

      if (!activeTabId) return;

      const newTabs = currentTabs.filter((tab) => tab.id !== id);

      if (newTabs.length === 0) {
        const newTab = { ...INITIAL_TABS[0], id: generateId() };
        queryClient.setQueryData([QUERY_KEYS.TABS], [newTab]);
        queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], newTab.id);
        saveTabsToStorage([newTab]);
        saveActiveTabIdToStorage(newTab.id);
        return;
      }

      if (id === activeTabId) {
        queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], newTabs[0].id);
        saveActiveTabIdToStorage(newTabs[0].id);
      }

      queryClient.setQueryData([QUERY_KEYS.TABS], newTabs);
      saveTabsToStorage(newTabs);
    },
    [queryClient]
  );
}

export function useCreateTab() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    const currentTabs =
      queryClient.getQueryData<Tab[]>([QUERY_KEYS.TABS]) || [];
    const newTab = createNewTab();

    const updatedTabs = [...currentTabs, newTab];
    queryClient.setQueryData([QUERY_KEYS.TABS], updatedTabs);
    queryClient.setQueryData([QUERY_KEYS.CURRENT_TAB_ID], newTab.id);
    saveTabsToStorage(updatedTabs);
    saveActiveTabIdToStorage(newTab.id);
  }, [queryClient]);
}
