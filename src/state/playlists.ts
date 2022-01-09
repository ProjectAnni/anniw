import { atom } from "recoil";
import { PlaylistInfo } from "@/types/common";

export const PlaylistsState = atom<PlaylistInfo[]>({
    key: "PlaylistsState",
    default: [],
});
