import request from "@/api/request";
import {
    PatchPlaylistInfoBody,
    Playlist,
    PlaylistInfo,
    RemovePlaylistItemBody,
} from "@/types/playlist";

export const queryPlaylistDetail = (id: string) => request.get<Playlist>("/api/playlist", { id });

export const updatePlaylistInfo = ({
    id,
    name,
    description,
    isPublic,
    cover,
}: Omit<PlaylistInfo, "owner">) =>
    request.patch<PatchPlaylistInfoBody, Playlist>("/api/playlist", {
        id,
        command: "info",
        payload: {
            name,
            description,
            isPublic,
            cover,
        },
    });

export const deleteTrackFromPlaylist = (playlistId: string, trackId: string) => {
    return request.patch<RemovePlaylistItemBody, Playlist>("/api/playlist", {
        id: playlistId,
        command: "remove",
        payload: [trackId],
    });
};
