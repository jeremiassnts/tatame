import axios from "axios";

const tatameClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_TATAME_API_URL}/api`,
});
export default tatameClient;
