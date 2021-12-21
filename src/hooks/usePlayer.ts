import { useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { NowPlayingInfoState, PlayerState, PlayerStatusState } from "@/state/player";
import { PlayerStatus, PlaylistItem } from "@/types/common";

function getAudioUrl(url: string) {
    if (window.MediaSource) {
        const mediaSource = new MediaSource();
        mediaSource.addEventListener("sourceopen", () => {
            fetch(url, { cache: "force-cache" }).then((resp) => {
                // set source buffer mime type
                const mime = resp.headers.get("Content-Type") || "audio/aac";
                const duration = resp.headers.get("X-Duration-Seconds") || "300";
                const sourceBuffer = mediaSource.addSourceBuffer(mime);
                let isSourceRemoved = false;

                // set media source duration
                mediaSource.duration = Number(duration);

                // get body as reader
                const reader = resp.body?.getReader();
                const appendBuffer = ({
                    done,
                    value,
                }: ReadableStreamDefaultReadResult<Uint8Array>) => {
                    if (!isSourceRemoved) {
                        if (!done && value) {
                            // body not finished, append buffer
                            sourceBuffer.appendBuffer(value);
                        } else {
                            // update duration after stream ends
                            mediaSource.endOfStream();
                        }
                    }
                };
                mediaSource.sourceBuffers.addEventListener("removesourcebuffer", () => {
                    isSourceRemoved = true;
                });
                // read body on source buffer update ends
                sourceBuffer.addEventListener("updateend", () => reader?.read().then(appendBuffer));
                // read body once
                reader?.read().then(appendBuffer);
            });
        });
        return URL.createObjectURL(mediaSource);
    } else {
        return url;
    }
}

const setMediaSessionMetadata = ({
    title,
    artist,
    album,
    cover,
}: Partial<Record<string, string>>) => {
    if (window.navigator.mediaSession)
        window.navigator.mediaSession.metadata = new MediaMetadata({
            title,
            artist,
            album,
            ...(cover
                ? {
                      artwork: [{ src: cover, sizes: "512x512", type: "image/jpeg" }],
                  }
                : {}),
        });
};

export default function usePlayer() {
    const player = useRecoilValue(PlayerState);
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    const setNowPlayingInfo = useSetRecoilState(NowPlayingInfoState);
    const play = useCallback(
        ({
            playUrl,
            title,
            artist,
            albumTitle,
            albumId,
            coverUrl,
            discIndex,
            trackIndex,
        }: PlaylistItem) => {
            if (!playUrl) {
                return;
            }
            player.src = getAudioUrl(playUrl);
            setPlayerStatus(PlayerStatus.BUFFERING);
            player.addEventListener(
                "canplay",
                () => {
                    player.play();
                    setPlayerStatus(PlayerStatus.PLAYING);
                    setNowPlayingInfo({
                        title,
                        artist,
                        albumTitle,
                        albumId,
                        coverUrl,
                        discIndex,
                        trackIndex,
                    });
                    setMediaSessionMetadata({
                        title,
                        artist,
                        album: albumTitle,
                        cover: coverUrl,
                    });
                },
                { once: true }
            );
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
