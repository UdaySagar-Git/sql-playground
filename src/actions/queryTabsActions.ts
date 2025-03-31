import { Tab } from "@/types";
import { LOCAL_STORAGE_TABS_KEY, LOCAL_STORAGE_ACTIVE_TAB_KEY } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export const INITIAL_TABS: Tab[] = [];

export function useTabsStorage() {
  const [tabs, setTabs] = useLocalStorage<Tab[]>(
    LOCAL_STORAGE_TABS_KEY,
    INITIAL_TABS,
    true
  );
  const [activeTabId, setActiveTabId] = useLocalStorage<string>(
    LOCAL_STORAGE_ACTIVE_TAB_KEY,
    "",
    false
  );

  return {
    tabs,
    setTabs,
    activeTabId,
    setActiveTabId,
  };
}

export const createNewTab = (): Tab => {
  return {
    id: generateId(),
    query: "",
  };
};
