import { selectorFamily } from "recoil";
import { handleResponseBody } from "./request";

export interface Playlist {
  id: string,
  name: string,
  description: string,
  owner: string,
  is_public: boolean,
  songs: (PlaylistSong & Id)[]
}

export type PlaylistSong = MusicIndex & {
  description: string
}

export const playlistQuery = selectorFamily<Playlist, string>({
  key: "Playlist",
  get: (id) => async (): Promise<Playlist> => fetch(`/api/playlist?id=${id}`).then(res => handleResponseBody(res)),
});