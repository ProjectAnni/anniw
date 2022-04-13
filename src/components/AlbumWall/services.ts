import { default as AlbumDB } from "@/db/album";
import request from "@/api/request";
import { formatResponse } from "@/utils/format";
import { AlbumDetail } from "@/types/common";

export async function getAlbumInfo(albumId: string) {
    // if no cache was found, try to fetch from server
    if (!(await AlbumDB.getAlbumInfo(albumId))) {
        const albumInfoResponse = await request.get<Record<string, AlbumDetail | null>>(
            `/api/meta/album`,
            {
                id: [albumId],
            },
            {
                formatResponse: false,
            }
        );
        const albumInfo: AlbumDetail = formatResponse(albumInfoResponse?.[albumId]);
        if (albumInfo) {
            await AlbumDB.addAlbumInfo(albumInfo);
        }
    }
    return await AlbumDB.getAlbumInfo(albumId);
}
