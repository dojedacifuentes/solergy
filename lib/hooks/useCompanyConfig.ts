"use client";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { COMPANY_CONFIG_DEFAULTS, type CompanyConfig } from "@/lib/config";

export function useCompanyConfig(): [CompanyConfig, (c: CompanyConfig) => void] {
  return useLocalStorage<CompanyConfig>("solergy_config", COMPANY_CONFIG_DEFAULTS);
}
