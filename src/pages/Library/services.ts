import request from "@/api/request";
import { AnnilToken } from "@/types/common";
import { LibraryInfoResponse } from "./types";

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
    return request.get<string[]>(
        `${library.url}/albums`,
        {
            auth: library.token,
        },
        {
            unwrapResponse: false,
        }
    );
}

export function getLibraryInfo(library: AnnilToken) {
    return request.get<LibraryInfoResponse>(
        `${library.url}/info`,
        {},
        {
            unwrapResponse: false,
        }
    );
}
