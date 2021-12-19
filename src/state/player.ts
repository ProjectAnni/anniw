import { atom } from "recoil";
import { PlayerStatus } from "@/types/common";

interface NowPlayingInfo {
    url?: string;
    title?: string;
    artist?: string;
    album?: string;
    albumId?: string;
    cover?: string;
}

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
    default: PlayerStatus.PAUSED,
});

export const NowPlayingInfoState = atom<NowPlayingInfo>({
    key: "NowPlayingInfoState",
    default: {},
});
