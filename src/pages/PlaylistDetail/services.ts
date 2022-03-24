import request from "@/api/request";
import { Playlist } from "@/types/common";

export const queryPlaylistDetail = (id: number) => request.get<Playlist>("/api/playlist", { id });

export const updatePlaylistInfo = ({
    id,
    name,
    description,
    isPublic,
}: {
    id: string;
    name: string;
    description: string;
    isPublic: boolean;
}) =>
    request.patch("/api/playlist", {
        id,
        command: "info",
        payload: {
            name,
            description,
            isPublic,
        },
    });
