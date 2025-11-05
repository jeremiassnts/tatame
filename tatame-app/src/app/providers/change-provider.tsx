import { createContext, useState } from "react";

export interface ChangeContextType {
  lastChangeId: Map<string, number>;
  updateLastChangeId: (key: string) => void;
}

export interface ChangeProviderProps {
  children: React.ReactNode;
}

export const ChangeContext = createContext({} as ChangeContextType);

export function ChangeProvider({ children }: ChangeProviderProps) {
  const [lastChangeId, setLastChangeId] = useState<Map<string, number>>(
    new Map()
  );

  function updateLastChangeId(key: string) {
    setLastChangeId(lastChangeId.set(key, Math.random()));
  }

  return (
    <ChangeContext.Provider value={{ lastChangeId, updateLastChangeId }}>
      {children}
    </ChangeContext.Provider>
  );
}
