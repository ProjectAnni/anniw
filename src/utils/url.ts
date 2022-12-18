export const addQueries = (originUrl: string, newQuery: Record<string, string>) => {
    const parsedUrl = new URL(originUrl);
    for (const key of Object.keys(newQuery)) {
        parsedUrl.searchParams.append(key, newQuery[key]);
    }
    return parsedUrl.href;
};
