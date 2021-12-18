import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PlayerState, PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";

export default function usePlayer() {
    const player = useRecoilValue(PlayerState);
    const setPlayerStatus = useSetRecoilState(PlayerStatusState);
    const play = useCallback(
        (url: string) => {
            player.src = url;
            player.play();
            setPlayerStatus(PlayerStatus.PLAYING);
        },
        [player, setPlayerStatus]
    );
    const resume = useCallback(() => {
        player.play();
        setPlayerStatus(PlayerStatus.PLAYING);
    }, [player, setPlayerStatus]);
    const pause = useCallback(() => {
        player.pause();
        setPlayerStatus(PlayerStatus.PAUSED);
    }, [player, setPlayerStatus]);
    const setVolume = useCallback(
        (volume: number) => {
            player.volume = volume;
        },
        [player]
    );
    useEffect(() => {
        const onEnded = () => {
            setPlayerStatus(PlayerStatus.PAUSED);
        };
        player.addEventListener("ended", onEnded);
        return () => {
            player.removeEventListener("ended", onEnded);
        };
    }, [player, setPlayerStatus]);
    return [
        player,
        {
            play,
            resume,
            pause,
            setVolume,
        },
    ] as const;
}
