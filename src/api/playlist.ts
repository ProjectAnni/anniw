import { selectorFamily } from "recoil";
import { Indexable, MusicIndex } from "../types/common";
import request from "./request";

export interface Playlist {
    id: string;
    name: string;
    description: string;
    owner: string;
    is_public: boolean;
    songs: PlaylistSong[];
}

export interface PlaylistSong extends MusicIndex, Indexable {
    description: string;
}

export const playlistQuery = selectorFamily<Playlist, string>({
    key: "Playlist",
    get: (id) => async (): Promise<Playlist> => request.get<Playlist>(`/api/playlist`, { id }),
});
