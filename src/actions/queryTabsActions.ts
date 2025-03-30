import { Tab } from "@/types";
import {
  SAMPLE_QUERY1,
  LOCAL_STORAGE_TABS_KEY,
  LOCAL_STORAGE_ACTIVE_TAB_KEY,
  SAMPLE_QUERY2,
} from "@/lib/constants";
import { generateId } from "@/lib/utils";

export const INITIAL_TABS: Tab[] = [
  {
    id: generateId(),
    query: SAMPLE_QUERY1,
  },
  {
    id: generateId(),
    query: SAMPLE_QUERY2,
  },
];

export const loadTabsFromStorage = (): Tab[] => {
  try {
    const storedTabs = localStorage.getItem(LOCAL_STORAGE_TABS_KEY);
    if (storedTabs) {
      return JSON.parse(storedTabs);
    }
  } catch (error) {
    console.error("Error loading tabs from localStorage:", error);
  }
  return INITIAL_TABS;
};

export const saveTabsToStorage = (tabs: Tab[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TABS_KEY, JSON.stringify(tabs));
  } catch (error) {
    console.error("Error saving tabs to localStorage:", error);
  }
};

export const loadActiveTabIdFromStorage = (): string => {
  try {
    const storedActiveTabId = localStorage.getItem(
      LOCAL_STORAGE_ACTIVE_TAB_KEY
    );
    if (storedActiveTabId) {
      return storedActiveTabId;
    }
  } catch (error) {
    console.error("Error loading active tab ID from localStorage:", error);
  }
  return INITIAL_TABS[0].id;
};

export const saveActiveTabIdToStorage = (id: string) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_TAB_KEY, id);
  } catch (error) {
    console.error("Error saving active tab ID to localStorage:", error);
  }
};

export const createNewTab = (): Tab => {
  return {
    id: generateId(),
    query: "",
  };
};
