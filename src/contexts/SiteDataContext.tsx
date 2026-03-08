import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { SiteData, getSiteData, saveSiteData, resetSiteData, defaultSiteData } from '@/lib/siteData';

interface SiteDataContextType {
  siteData: SiteData;
  updateSiteData: (data: Partial<SiteData>) => void;
  resetToDefault: () => void;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);

  useEffect(() => {
    setSiteData(getSiteData());
  }, []);

  const updateSiteData = useCallback((data: Partial<SiteData>) => {
    setSiteData((prev) => {
      const newData = { ...prev, ...data };
      saveSiteData(newData);
      return newData;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    const data = resetSiteData();
    setSiteData(data);
  }, []);

  return (
    <SiteDataContext.Provider value={{ siteData, updateSiteData, resetToDefault }}>
      {children}
    </SiteDataContext.Provider>
  );
}

const fallbackContext: SiteDataContextType = {
  siteData: defaultSiteData,
  updateSiteData: () => {},
  resetToDefault: () => {},
};

export function useSiteData() {
  const context = useContext(SiteDataContext);
  return context ?? fallbackContext;
}
