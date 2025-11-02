import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SUPABASE_FUNCTIONS_URL,
});
export default axiosClient;
