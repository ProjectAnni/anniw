import request from "@/api/request";
import { AnnilToken } from "@/types/common";

export function getAvailableAnnilTokens() {
    return request.get<AnnilToken[]>("/api/credential");
}

export function deleteAnnilToken(id: string) {
    return request.delete(`/api/credential`, {
        id,
    });
}

export function createAnnilToken({ name, token, url, priority }: Omit<AnnilToken, "id">) {
    return request.post<AnnilToken>("/api/credential", {
        name,
        token,
        url,
        priority,
    });
}

export function getLibraryAlbums(library: AnnilToken) {
    return request.get(`${library.url}/albums`, {
        auth: library.token,
    });
}
