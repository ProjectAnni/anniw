import { camelCase, snakeCase } from "lodash";

export function formatResponse(response: any): any {
    if (response === null || response === undefined) {
        return response;
    }
    if (Array.isArray(response)) {
        return response.map(formatResponse);
    }
    if (typeof response === "string") {
        return response;
    }
    if (typeof response === "number") {
        return response;
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(response)) {
        if (typeof response[key] === "object") {
            result[camelCase(key)] = formatResponse(response[key]);
        } else {
            result[camelCase(key)] = response[key];
        }
    }
    return result;
}

export function formatRequest(request: any): any {
    if (Array.isArray(request)) {
        return request.map(formatRequest);
    }
    if (typeof request === "string") {
        return request;
    }
    if (request === null || request === undefined) {
        request = {};
    }
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(request)) {
        if (typeof request[key] === "object") {
            result[snakeCase(key)] = formatRequest(request[key]);
        } else {
            result[snakeCase(key)] = request[key];
        }
    }
    return result;
}
