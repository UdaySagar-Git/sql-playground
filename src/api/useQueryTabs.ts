import { useState, useCallback } from "react";
import { Tab } from "@/types";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/constants";

const INITIAL_TAB: Tab = { id: "1", name: "Query 1", query: "" };

export function useTabs(initialTabs: Tab[] = [INITIAL_TAB]) {
  const [tabs, setTabs] = useState<Tab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(
    initialTabs[0]?.id || INITIAL_TAB.id
  );

  const currentTab = tabs.find((tab) => tab.id === activeTabId) || INITIAL_TAB;

  const handleTabSelect = useCallback(
    (id: string) => {
      setActiveTabId(id);
      const selectedTab = tabs.find((tab) => tab.id === id);
      if (selectedTab) {
        queryClient.setQueryData([QUERY_KEYS.CURRENT_QUERY], selectedTab.query);
      }
    },
    [tabs]
  );

  const handleTabClose = useCallback(
    (id: string) => {
      setTabs((prev) => {
        const newTabs = prev.filter((tab) => tab.id !== id);
        if (newTabs.length === 0) {
          const newTab = { ...INITIAL_TAB, id: Date.now().toString() };
          setActiveTabId(newTab.id);
          queryClient.setQueryData([QUERY_KEYS.CURRENT_QUERY], newTab.query);
          return [newTab];
        }
        if (id === activeTabId) {
          setActiveTabId(newTabs[0].id);
          queryClient.setQueryData(
            [QUERY_KEYS.CURRENT_QUERY],
            newTabs[0].query
          );
        }
        return newTabs;
      });
    },
    [activeTabId]
  );

  const handleNewTab = useCallback(() => {
    const newTab = {
      id: Date.now().toString(),
      name: `Query ${tabs.length + 1}`,
      query: "",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
    queryClient.setQueryData([QUERY_KEYS.CURRENT_QUERY], newTab.query);
  }, [tabs.length]);

  const updateCurrentTabQuery = useCallback(
    (query: string) => {
      setTabs((prev) =>
        prev.map((tab) => (tab.id === activeTabId ? { ...tab, query } : tab))
      );
      queryClient.setQueryData([QUERY_KEYS.CURRENT_QUERY], query);
    },
    [activeTabId]
  );

  return {
    tabs,
    activeTabId,
    currentTab,
    handleTabSelect,
    handleTabClose,
    handleNewTab,
    updateCurrentTabQuery,
  };
}
