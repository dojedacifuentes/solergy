"use client";
import { useState, useCallback } from "react";
import { ADMIN_CREDENTIALS } from "@/lib/config";

const SESSION_KEY = "solergy_admin_session";

function readSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function useAdminSession() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    readSession()
  );

  const login = useCallback((user: string, pass: string): boolean => {
    if (
      user === ADMIN_CREDENTIALS.username &&
      pass === ADMIN_CREDENTIALS.password
    ) {
      try {
        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(SESSION_KEY, "1");
        }
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
