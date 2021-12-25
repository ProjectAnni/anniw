import request from "@/api/request";

export async function getTags() {
    return await request.get<string[]>("/api/meta/tags");
}

export async function getTagGraph() {
    return await request.get<Record<string, string[]>>("/api/meta/tag-graph", undefined, {
        formatResponse: false,
    });
}

interface AlbumInfo {
    albumId: string;
}

export async function getAlbumsByTag(tag: string) {
    return await request.get<AlbumInfo[]>("/api/meta/albums/by-tag", { tag });
}
