import { camelCase, snakeCase } from "lodash";

export function formatResponse(response: any): any {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(response)) {
        if (typeof response[key] === "object" && !Array.isArray(response[key])) {
            result[camelCase(key)] = formatResponse(response[key]);
        } else {
            result[camelCase(key)] = response[key];
        }
    }
    return result;
}

export function formatRequest(request: any): any {
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(request)) {
        if (typeof request[key] === "object" && !Array.isArray(request[key])) {
            result[snakeCase(key)] = formatRequest(request[key]);
        } else {
            result[snakeCase(key)] = request[key];
        }
    }
    return result;
}
