import axios from "axios";
import { env } from "../env";

const axiosClient = axios.create({
  baseURL: "http://192.168.1.103:3333/", //env.EXPO_PUBLIC_TATAME_API_URL,
});
export default axiosClient;
