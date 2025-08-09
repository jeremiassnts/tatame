import React, {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import { UserType } from "../constants/user-type";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserTypeProviderProps {
  children: ReactNode;
}
export interface UserTypeContextType {
  userType: UserType | null;
  selectUserType: (type: UserType) => Promise<void>;
  isLoaded: boolean;
}
export const UserTypeContext = createContext({} as UserTypeContextType);
export const useUserType = () => {
  return useContext(UserTypeContext);
};
export default function UserTypeProvider({ children }: UserTypeProviderProps) {
  const [userType, setUserType] = useState<UserType | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const selectUserType = async (type: UserType) => {
    setUserType(type);
    await AsyncStorage.setItem("userType", type);
  };

  useEffect(() => {
    const loadUserType = async () => {
      const storageUserType = await AsyncStorage.getItem("userType");
      if (storageUserType) {
        setUserType(storageUserType as UserType);
      }
      setIsLoaded(true);
    };
    loadUserType();
  }, []);

  return (
    <UserTypeContext.Provider value={{ userType, selectUserType, isLoaded }}>
      {children}
    </UserTypeContext.Provider>
  );
}
