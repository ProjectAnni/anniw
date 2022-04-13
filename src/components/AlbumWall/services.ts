import album, { default as AlbumDB } from "@/db/album";
import request from "@/api/request";
import { formatResponse } from "@/utils/format";
import { AlbumDetail, InheritedAlbumDetail } from "@/types/common";

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
    const albumInfo: AlbumDetail = formatResponse(albumInfoResponse?.[albumId]);
    if (albumInfo) {
        // inherit fields
        for (const disc of albumInfo.discs) {
            if (!disc.title) {
                disc.title = albumInfo.title;
            }
            for (const track of disc.tracks) {
                if (!track.type) {
                    track.type = disc.type ?? albumInfo.type;
                }
                if (!track.artist) {
                    track.artist = disc.artist ?? albumInfo.artist;
                }
                if (!track.artists) {
                    track.artists = disc.artists ?? albumInfo.artists;
                }
            }
        }
        await AlbumDB.addAlbumInfo(albumInfo as InheritedAlbumDetail);
        return albumInfo;
    }
}
