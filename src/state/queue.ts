import { atom } from "recoil";
import { PlayQueueItem } from "@/types/common";

export const PlayQueueState = atom<PlayQueueItem[]>({
    key: "PlayQueueState",
    default: [],
});

export const CurrentPlayIndex = atom({
    key: "CurrentPlayIndex",
    default: 0,
});
