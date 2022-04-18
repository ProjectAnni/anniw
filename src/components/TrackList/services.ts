import { TrackIdentifier } from "@/types/common";
import request from "@/api/request";
import { AppendPlaylistBody, CreatePlaylistBody, PlaylistInfo } from "@/types/playlist";

export function addFavorite<T extends TrackIdentifier>(track: T) {
    const { albumId, discId, trackId } = track;
    return request.put<TrackIdentifier>("/api/favorite/music", {
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
    return request.put<CreatePlaylistBody, PlaylistInfo>("/api/playlist", {
        name,
        description,
        isPublic,
        cover: { albumId: "", discId: 1 },
        items: [],
    });
}

export function addTrackToPlaylist({
    playlistId,
    trackId,
}: {
    playlistId: string;
    trackId: TrackIdentifier;
}) {
    return request.patch<AppendPlaylistBody, PlaylistInfo>("/api/playlist", {
        id: playlistId,
        command: "append",
        payload: [
            {
                type: "normal",
                info: trackId,
            },
        ],
    });
}
