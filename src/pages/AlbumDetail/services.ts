import request from "@/api/request";
import { default as AlbumDB } from "@/db/album";
import { formatResponse } from "@/utils/format";
import { AlbumDetail } from "@/types/common";

// AlbumDetail loads album metadata forcefully from server
export async function getAlbumInfo(albumId: string | null) {
    if (!albumId) {
        return;
    }
    const albumInfoResponse = await request.get<Record<string, AlbumDetail | null>>(
        `/api/meta/album`,
        {
            id: [albumId],
        },
        {
            formatResponse: false,
        }
    );
    const albumInfo = formatResponse(albumInfoResponse?.[albumId]) as AlbumDetail;
    if (albumInfo) {
        // save to database
        await AlbumDB.addAlbumInfo(albumInfo);
        // get InheritedAlbumDetail
        return await AlbumDB.getAlbumInfo(albumId);
    }
}

export async function getAlbumAvailableLibraries(albumId: string | null) {
    if (!albumId) {
        return;
    }
    return AlbumDB.getAvailableLibraries(albumId);
}
