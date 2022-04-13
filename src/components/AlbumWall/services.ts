import { default as AlbumDB } from "@/db/album";
import request from "@/api/request";
import { formatResponse } from "@/utils/format";
import { AlbumDetail } from "@/types/common";

export async function getAlbumInfo(albumId: string) {
    const cachedAlbumInfo = await AlbumDB.getAlbumInfo(albumId);
    if (cachedAlbumInfo) {
        return cachedAlbumInfo;
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
    const albumInfo = formatResponse(albumInfoResponse?.[albumId]);
    if (albumInfo) {
        await AlbumDB.addAlbumInfo(albumInfo);
        return albumInfo;
    }
}
