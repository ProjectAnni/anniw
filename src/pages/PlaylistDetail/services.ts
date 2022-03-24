import request from "@/api/request";
import { Playlist, PlaylistInfo } from "@/types/common";

export const queryPlaylistDetail = (id: number) => request.get<Playlist>("/api/playlist", { id });

export const updatePlaylistInfo = ({
    id,
    name,
    description,
    isPublic,
    cover,
}: Omit<PlaylistInfo, "owner">) =>
    request.patch("/api/playlist", {
        id,
        command: "info",
        payload: {
            name,
            description,
            isPublic,
            cover,
        },
    });
