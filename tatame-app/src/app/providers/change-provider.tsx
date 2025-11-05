import { createContext, useState } from "react";

export interface ChangeContextType {
  lastChangeId: number;
  updateLastChangeId: () => void;
}

export interface ChangeProviderProps {
  children: React.ReactNode;
}

export const ChangeContext = createContext({} as ChangeContextType);

export function ChangeProvider({ children }: ChangeProviderProps) {
  const [lastChangeId, setLastChangeId] = useState(Math.random());

  function updateLastChangeId() {
    setLastChangeId(Math.random());
  }

  return (
    <ChangeContext.Provider value={{ lastChangeId, updateLastChangeId }}>
      {children}
    </ChangeContext.Provider>
  );
}
