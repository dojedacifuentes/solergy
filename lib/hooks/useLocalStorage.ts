"use client";
import { useState, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (val: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (val: T) => {
      try {
        setStoredValue(val);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(val));
        }
      } catch {
        // silently ignore storage errors
      }
    },
    [key]
  );

  return [storedValue, setValue];
}
