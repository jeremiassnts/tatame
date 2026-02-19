import { useAuth } from "@clerk/clerk-expo";
import tatameClient from "../lib/tatame-api";

interface RequestOptions {
    isPublic?: boolean;
    headers?: Record<string, string>;
}

export function useApi() {
    const { getToken } = useAuth();

    async function getHeaders(
        options: RequestOptions = {},
    ): Promise<Record<string, string>> {
        if (options.isPublic) {
            return {
                ...options.headers,
            };
        } else {
            const token = await getToken();
            return {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            };
        }
    }

    async function get<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const headers = await getHeaders(options);
        const response = await tatameClient.get<T>(url, {
            headers,
        });
        return response.data;
    }

    async function post<T>(
        url: string,
        data: any,
        options: RequestOptions = {},
    ): Promise<T> {
        const headers = await getHeaders(options);
        const response = await tatameClient.post<T>(url, data, {
            headers,
        });
        return response.data;
    }

    async function del<T>(url: string, options: RequestOptions = {}): Promise<T> {
        const headers = await getHeaders(options);
        const response = await tatameClient.delete<T>(url, {
            headers,
        });
        return response.data;
    }

    async function put<T>(
        url: string,
        data: any,
        options: RequestOptions = {},
    ): Promise<T> {
        const headers = await getHeaders(options);
        const response = await tatameClient.put<T>(url, data, {
            headers,
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
