import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { formatRequest, formatResponse } from "../utils/format";

export class AnniwRequestError extends Error {}

export class AnniwBusinessError extends Error {
    code: number;
    constructor(code: number, message: string) {
        super(message);
        this.code = code;
    }
}

export interface RequestOptions {
    /** 是否从 Anniv 返回格式中直接取出 data 字段 */
    unwrapResponse?: boolean;
    /** 是否自动 snake-case 转 camel-case */
    formatResponse?: boolean;
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
    async request<Response, Request = Record<string, unknown>>(
        method: HttpMethod = "GET",
        path = "/",
        payload: Request,
        requestOptions?: RequestOptions
    ): Promise<Response> {
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
        const { unwrapResponse = true, formatResponse: isFormatResponse = true } =
            requestOptions || {};
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
                    return isFormatResponse ? formatResponse(data.data) : data.data;
                }
            } else {
                return isFormatResponse ? formatResponse(data) : data;
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
    post<P, R = unknown>(path = "/", payload: P, requestOptions?: RequestOptions) {
        return this.request<R, P>("POST", path, payload, requestOptions);
    }

    /**
     * HTTP POST
     * @param path
     * @param payload
     */
    put<P, R = unknown>(path = "/", payload: P, requestOptions?: RequestOptions) {
        return this.request<R, P>("PUT", path, payload, requestOptions);
    }

    /**
     * HTTP PATCH
     * @param path
     * @param payload
     * @returns
     */
    patch<P, R>(path = "/", payload: P, requestOptions?: RequestOptions) {
        return this.request<R, P>("PATCH", path, payload, requestOptions);
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
