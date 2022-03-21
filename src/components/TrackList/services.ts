import { PlaylistInfo, TrackIdentifier } from "@/types/common";
import request from "@/api/request";

export function addFavorite<T extends TrackIdentifier>(track: T) {
    const { albumId, discId, trackId } = track;
    return request.put("/api/favorite/music", {
        albumId,
        discId,
        trackId,
    });
}

export function removeFavorite<T extends TrackIdentifier>(track: T) {
    const { albumId, discId, trackId } = track;
    return request.delete("/api/favorite/music", {
        albumId,
        discId,
        trackId,
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
