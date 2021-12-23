import request from "@/api/request";
import { SearchResult } from "./types";

interface SearchAlbumParams {
    keyword: string;
}

export async function searchAlbums({ keyword }: SearchAlbumParams) {
    return request.get<SearchResult>("/api/search", {
        searchAlbums: true,
        keyword,
    });
}
