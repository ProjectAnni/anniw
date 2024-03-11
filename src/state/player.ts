import { atom } from "recoil";
import { PlayerStatus, PlayQueueItem } from "@/types/common";

export const PlayerState = atom({
    key: "PlayerState",
    default: (async () => {
        const audioEl = new Audio();
        audioEl.preload = "auto";
        return audioEl;
    })(),
});

export const PlayerStatusState = atom({
    key: "PlayerStatusState",
    default: PlayerStatus.EMPTY,
});

export const NowPlayingInfoState = atom<Partial<PlayQueueItem>>({
    key: "NowPlayingInfoState",
    default: {},
});

export const PlayerDurationState = atom({
    key: "PlayerDurationState",
    default: 0,
});
