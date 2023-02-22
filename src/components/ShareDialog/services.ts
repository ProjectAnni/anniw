import { AlbumIdentifier, AnnilToken, DiscIdentifier, TrackInfoWithAlbum } from "@/types/common";
import request from "@/api/request";
import { groupBy } from "lodash";
import { getAvailableLibraryForAlbum } from "@/utils/library";

class NoAvailableTokenForShare extends Error {}

export interface CreateShareLinkParams {
    name: string;
    description: string;
    cover: DiscIdentifier;
    tracks: TrackInfoWithAlbum[];
    allCredentials: AnnilToken[];
}

export async function createShareLink({
    name,
    description,
    cover,
    tracks,
    allCredentials,
}: CreateShareLinkParams): Promise<string> {
    const exportedTrackList = Object.entries(groupBy(tracks, (track) => track.albumId))
        .map(([albumId, albumTracks]) =>
            Object.entries(groupBy(albumTracks, (track) => track.discId)).map(
                ([discId, discTracks]) => ({
                    album_id: albumId,
                    disc_id: +discId,
                    tracks: discTracks.map((track) => track.trackId),
                })
            )
        )
        .flat();
    const albumIds = Object.keys(groupBy(tracks, (track) => track.albumId));
    const albumTokenIdMap: Record<AlbumIdentifier, string> = {};
    for (const albumId of albumIds) {
        const tokenIdForAlbum = await getAvailableLibraryForAlbum(albumId, allCredentials, true);
        if (tokenIdForAlbum) {
            albumTokenIdMap[albumId] = tokenIdForAlbum.id;
        } else {
            throw new NoAvailableTokenForShare("无可用于分享的Token");
        }
    }
    const payload = {
        info: {
            name,
            description,
            cover: {
                album_id: cover.albumId,
                disc_id: +cover.discId,
            },
            songs: exportedTrackList,
        },
        albums: albumTokenIdMap,
    };
    return request.post<typeof payload, string>("/api/share", payload, {
        formatRequest: false,
    });
}
