import request from "@/api/request";
import { Playlist, PlaylistInfo } from "@/types/common";

export const queryPlaylistDetail = (id: string) => request.get<Playlist>("/api/playlist", { id });

export const updatePlaylistInfo = ({
    id,
    name,
    description,
    isPublic,
    cover,
}: Omit<PlaylistInfo, "owner">) =>
    request.patch<Playlist>("/api/playlist", {
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
    return request.patch<Playlist>("/api/playlist", {
        id: playlistId,
        command: "remove",
        payload: [trackId],
    });
};
