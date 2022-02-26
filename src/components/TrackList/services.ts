import { groupBy } from "lodash";
import { AnnilToken, PlaylistInfo, PlayQueueItem, TrackIdentifier } from "@/types/common";
import { default as AlbumDB } from "@/db/album";
import request from "@/api/request";

interface IndexableTrackItem {
    albumId: string;
    discIndex: number;
    trackIndex: number;
}

export async function getAvailableLibraryForTrack(
    track: PlayQueueItem,
    allCredentials: AnnilToken[]
): Promise<AnnilToken | undefined> {
    const { albumId } = track;
    const availableLibraries = await AlbumDB.getAvailableLibraries(albumId);
    if (availableLibraries.length > 0) {
        const credentialUrlMap = groupBy(
            allCredentials.filter((c) => availableLibraries.includes(c.url)),
            "url"
        );
        const librariesByPriority = availableLibraries.sort(
            (a, b) => credentialUrlMap[b][0].priority - credentialUrlMap[a][0].priority
        );
        return credentialUrlMap[librariesByPriority[0]][0];
    }
}

export function getPlayUrlForTrack<T extends IndexableTrackItem>(track: T, credential: AnnilToken) {
    const { albumId, discIndex, trackIndex } = track;
    const { url, token } = credential;
    return `${url}/${albumId}/${discIndex + 1}/${trackIndex + 1}?auth=${token}`;
}

export function getCoverUrlForTrack<T extends IndexableTrackItem>(track: T, credential: AnnilToken) {
    const { albumId, discIndex } = track;
    const { url } = credential;
    return `${url}/${albumId}/${discIndex + 1}/cover`;
}

export function addFavorite<T extends IndexableTrackItem>(track: T) {
    const { albumId, discIndex, trackIndex } = track;
    return request.put("/api/favorite/music", {
        albumId,
        discId: discIndex + 1,
        trackId: trackIndex + 1,
    });
}

export function removeFavorite<T extends IndexableTrackItem>(track: T) {
    const { albumId, discIndex, trackIndex } = track;
    return request.delete("/api/favorite/music", {
        albumId,
        discId: discIndex + 1,
        trackId: trackIndex + 1,
    });
}

export function createPlaylist({
    name,
    description,
    isPublic,
}: {
    name: string;
    description: string;
    isPublic: boolean;
}) {
    return request.put<PlaylistInfo>("/api/playlist", { name, description, isPublic });
}

export function addTrackToPlaylist({
    playlistId,
    trackId,
}: {
    playlistId: string;
    trackId: TrackIdentifier;
}) {
    return request.patch<PlaylistInfo>("/api/playlist", {
        id: playlistId,
        command: "append",
        payload: [
            {
                type: "normal",
                ...trackId,
            },
        ],
    });
}
