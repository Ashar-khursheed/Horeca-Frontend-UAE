import { useCallback } from "react";

function useLocalStorage() {
  const setItem = useCallback(<T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage quota exceeded or private mode
    }
  }, []);

  const getItem = useCallback(<T>(key: string): T | null => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        // stored as plain string (e.g. auth token), return as-is
        return raw as unknown as T;
      }
    } catch {
      return null;
    }
  }, []);

  const removeItem = useCallback((key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, []);

  return { setItem, getItem, removeItem };
}

export default useLocalStorage;
