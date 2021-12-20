import { atom } from "recoil";
import { PlaylistItem } from "@/types/common";

export const PlaylistState = atom<PlaylistItem[]>({
    key: "PlaylistState",
    default: [],
})