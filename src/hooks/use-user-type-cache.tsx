import { useAuth } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../constants/user-type";

export function useUserTypeCache() {
  const { userId } = useAuth();
  
  function getCacheKey() {
    return `userType:${userId}`;
  }
  async function getUserType() {
    return AsyncStorage.getItem(getCacheKey());
  }
  async function setUserType(userType: UserType) {
    return AsyncStorage.setItem(getCacheKey(), userType);
  }
  async function clearUserType() {
    return AsyncStorage.removeItem(getCacheKey());
  }

  return { getUserType, setUserType, clearUserType };
}
