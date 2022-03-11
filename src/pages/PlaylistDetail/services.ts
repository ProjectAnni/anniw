import request from "@/api/request";
import { Playlist } from "@/types/common";

export const queryPlaylistDetail = (id: number) => request.get<Playlist>("/api/playlist", { id });
