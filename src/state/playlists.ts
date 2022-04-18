import { atom } from "recoil";
import { PlaylistInfo } from "@/types/playlist";

export const PlaylistsState = atom<PlaylistInfo[]>({
    key: "PlaylistsState",
    default: [],
});
