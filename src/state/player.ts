import { atom } from "recoil";
import { PlayerStatus } from "@/types/common";

export const PlayerState = atom({
    key: "PlayerState",
    default: new Audio(),
});

export const PlayerStatusState = atom({
    key: "PlayerStatusState",
    default: PlayerStatus.PAUSED,
});
