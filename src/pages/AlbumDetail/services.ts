import request from "@/api/request";
import { default as AlbumDB } from "@/db/album";
import { formatResponse } from "@/utils/format";
import { AlbumInfo } from "@/types/common";

export async function getAlbumInfo(albumId: string | null) {
    if (!albumId) {
        return;
    }
    const cachedAlbumInfo = await AlbumDB.getAlbumInfo(albumId);
    if (cachedAlbumInfo) {
        return cachedAlbumInfo;
    }
    const albumInfoResponse = await request.get<Record<string, AlbumInfo | null>>(
        `/api/meta/album`,
        {
            id: [albumId],
        },
        {
            formatResponse: false,
        }
    );
    const albumInfo = formatResponse(albumInfoResponse?.[albumId]) as AlbumInfo;
    if (albumInfo) {
        await AlbumDB.addAlbumInfo(albumInfo);
        return albumInfo;
    }
}

export async function deleteAlbumInfoCache(albumId?: string) {
    if (!albumId) {
        return;
    }
    return AlbumDB.deleteAlbumInfo(albumId);
}

export async function getAlbumAvailableLibraries(albumId: string | null) {
    if (!albumId) {
        return;
    }
    return AlbumDB.getAvailableLibraries(albumId);
}