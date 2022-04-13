import request from "@/api/request";
import { default as AlbumDB } from "@/db/album";
import { formatResponse } from "@/utils/format";
import { AlbumInfo, InheritedAlbumDetail } from "@/types/common";

export async function getAlbumInfo(albumId: string | null) {
    if (!albumId) {
        return;
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
    const albumInfo = formatResponse(albumInfoResponse?.[albumId]) as InheritedAlbumDetail;
    if (albumInfo) {
        return albumInfo;
    }
}

export async function getAlbumAvailableLibraries(albumId: string | null) {
    if (!albumId) {
        return;
    }
    return AlbumDB.getAvailableLibraries(albumId);
}
