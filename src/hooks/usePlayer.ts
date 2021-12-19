import { useCallback, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { NowPlayingInfoState, PlayerState, PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";

interface PlayParams {
    url: string;
    title?: string;
    artist?: string;
    album?: string;
    albumId?: string;
    cover?: string;
}

export default function usePlayer() {
    const player = useRecoilValue(PlayerState);
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    const setNowPlayingInfo = useSetRecoilState(NowPlayingInfoState);
    const play = useCallback(
        ({ url, title, artist, album, albumId, cover }: PlayParams) => {
            player.src = url;
            player.play();
            setPlayerStatus(PlayerStatus.PLAYING);
            setNowPlayingInfo({ url, title, artist, album, albumId, cover });
            if (window.navigator.mediaSession)
                window.navigator.mediaSession.metadata = new MediaMetadata({
                    title,
                    artist,
                    album,
                    ...(cover
                        ? { artwork: [{ src: cover, sizes: "512x512", type: "image/png" }] }
                        : {}),
                });
        },
        [player, setPlayerStatus, setNowPlayingInfo]
    );
    const restart = useCallback(() => {
        player.currentTime = 0;
        player.play();
    }, [player]);
    const resume = useCallback(() => {
        player.play();
        setPlayerStatus(PlayerStatus.PLAYING);
    }, [player, setPlayerStatus]);
    const pause = useCallback(() => {
        player.pause();
        setPlayerStatus(PlayerStatus.PAUSED);
    }, [player, setPlayerStatus]);
    const seek = useCallback(
        (time: number) => {
            player.currentTime = time;
        },
        [player]
    );
    const setVolume = useCallback(
        (volume: number) => {
            player.volume = volume;
        },
        [player]
    );
    useEffect(() => {
        const onEnded = () => {
            setPlayerStatus(PlayerStatus.ENDED);
        };
        player.addEventListener("ended", onEnded);
        return () => {
            player.removeEventListener("ended", onEnded);
        };
    }, [player, setPlayerStatus]);
    useEffect(() => {
        if (window.navigator.mediaSession) {
            navigator.mediaSession.setActionHandler("play", () => {
                if (playerStatus === PlayerStatus.ENDED) {
                    restart();
                } else {
                    resume();
                }
            });
            navigator.mediaSession.setActionHandler("pause", pause);
        }
    }, [pause, playerStatus, restart, resume]);
    return [
        player,
        {
            play,
            resume,
            restart,
            pause,
            setVolume,
            seek,
        },
    ] as const;
}
