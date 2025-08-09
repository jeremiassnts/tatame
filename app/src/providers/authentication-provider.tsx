import React, {
  createContext,
  ReactNode,
  useState,
  useContext,
  useEffect,
} from "react";
import * as SecureStore from "expo-secure-store";

interface AuthenticationProviderProps {
  children: ReactNode;
}
export interface AuthenticationContextType {
  signIn: (accessToken: string, expiresIn: Date) => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<{
    accessToken: string | null;
    expiresIn: Date | null;
  }>;
  isAuthenticated: boolean;
  isLoaded: boolean;
}
export const AuthenticationContext = createContext(
  {} as AuthenticationContextType
);
export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};
export default function AuthenticationProvider({
  children,
}: AuthenticationProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  async function signIn(accessToken: string, expiresIn: Date) {
    setAccessToken(accessToken);
    setExpiresIn(expiresIn);
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("expiresIn", expiresIn.toISOString());
    setIsAuthenticated(true);
  }

  async function signOut() {
    setAccessToken(null);
    setExpiresIn(null);
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("expiresIn");
    setIsAuthenticated(false);
  }

  async function loadSession() {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const expiresIn = await SecureStore.getItemAsync("expiresIn");
    if (accessToken && expiresIn && new Date(expiresIn) > new Date()) {
      setAccessToken(accessToken);
      setExpiresIn(new Date(expiresIn));
      setIsAuthenticated(true);
    } else {
      await signOut();
    }
    setIsLoaded(true);
  }

  async function getSession() {
    await loadSession();
    return { accessToken, expiresIn };
  }

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  return (
    <AuthenticationContext.Provider
      value={{ signIn, signOut, getSession, isAuthenticated, isLoaded }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
