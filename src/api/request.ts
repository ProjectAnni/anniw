import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { formatRequest, formatResponse } from "../utils/format";

export class AnniwRequestError extends Error {}

export class AnniwBusinessError extends Error {
    code: string;
    constructor(code: string, message: string) {
        super(message);
        this.code = code;
    }
}

export interface RequestOptions {
    /** 是否从 Anniv 返回格式中直接取出 data 字段 */
    unwrapResponse?: boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

class Request {
    private base = "";
    private instance: AxiosInstance;
    constructor() {
        this.instance = axios.create({
            timeout: 10000,
        });
    }

    setBasePath(base: string): void {
        this.base = base;
    }

    /**
     * HTTP Request
     * @param method
     * @param path
     * @param payload
     */
    async request<T>(
        method: HttpMethod = "GET",
        path = "/",
        payload: Record<string, unknown> = {},
        requestOptions?: RequestOptions
    ): Promise<T> {
        console.log(`[${new Date().toISOString()}] ${method} ${path}`);
        const options: AxiosRequestConfig = {
            method,
            url:
                path.startsWith("http://") || path.startsWith("https://")
                    ? path
                    : `${this.base}${path}`,
            params: {},
            data: {},
        };
        const { unwrapResponse = true } = requestOptions || {};
        if (method === "GET") {
            options.params = formatRequest(payload);
        } else {
            options.data = formatRequest(payload);
        }
        try {
            const response = await this.instance.request(options);
            const data = response.data;
            if (unwrapResponse) {
                if (data.status !== 0) {
                    throw new AnniwBusinessError(data.status, data.message);
                } else {
                    return formatResponse(data.data);
                }
            } else {
                return formatResponse(data);
            }
        } catch (e) {
            if (e instanceof AnniwBusinessError) {
                throw e;
            }
            // Network Error
            throw this.parseError(e as any);
        }
    }

    /**
     * HTTP GET
     * @param path
     * @param payload
     */
    get<T>(path = "/", payload: Record<string, unknown> = {}, requestOptions?: RequestOptions) {
        return this.request<T>("GET", path, payload, requestOptions);
    }

    /**
     * HTTP POST
     * @param path
     * @param payload
     */
    post<T>(path = "/", payload: Record<string, unknown> = {}, requestOptions?: RequestOptions) {
        return this.request<T>("POST", path, payload, requestOptions);
    }

    /**
     * HTTP PATCH
     * @param path
     * @param payload
     * @returns
     */
    patch<T>(path = "/", payload: Record<string, unknown> = {}, requestOptions?: RequestOptions) {
        return this.request<T>("PATCH", path, payload, requestOptions);
    }

    /**
     * HTTP DELETE
     * @param path
     * @param payload
     * @returns
     */
    delete<T>(path = "/", payload: Record<string, unknown> = {}, requestOptions?: RequestOptions) {
        return this.request<T>("DELETE", path, payload, requestOptions);
    }

    parseError(e: AxiosError): AnniwRequestError {
        if (e.request?.status) {
            return new AnniwRequestError(`网络错误: ${e.request.status} ${e.request.statusText}`);
        }
        return new AnniwRequestError("未知网络错误");
    }
}

export default new Request();
