import { useCallback } from "react";

function useSessionStorage() {
  const setItem = useCallback(<T>(key: string, value: T): void => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // private mode or quota exceeded
    }
  }, []);

  const getItem = useCallback(<T>(key: string): T | null => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw === null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch {
      return null;
    }
  }, []);

  const removeItem = useCallback((key: string): void => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, []);

  return { setItem, getItem, removeItem };
}

export default useSessionStorage;
