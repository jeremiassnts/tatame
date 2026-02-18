import { useAuth } from "@clerk/clerk-expo";
import tatameClient from "../lib/tatame-api";

export function useApi() {
    const { getToken } = useAuth();

    async function get<T>(url: string): Promise<T> {
        const token = await getToken();
        const response = await tatameClient.get<T>(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async function post<T>(url: string, data: any): Promise<T> {
        const token = await getToken();
        const response = await tatameClient.post<T>(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async function del<T>(url: string): Promise<T> {
        const token = await getToken();
        const response = await tatameClient.delete<T>(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    async function put<T>(url: string, data: any): Promise<T> {
        const token = await getToken();
        const response = await tatameClient.put<T>(url, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    return {
        get,
        post,
        del,
        put,
    };
}
