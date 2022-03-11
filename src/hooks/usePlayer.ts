import { useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { NowPlayingInfoState, PlayerState, PlayerStatusState } from "@/state/player";
import { PlayerStatus, PlayQueueItem } from "@/types/common";

async function getAudioUrl(url: string) {
    return await fetch(url, { method: "HEAD" }).then(async (resp) => {
        const mime = resp.headers.get("Content-Type") || "audio/aac";
        const originalMime = resp.headers.get("X-Origin-Type") || "audio/flac";
        const originalSize = Number(resp.headers.get("X-Origin-Size") || "0");
        const duration = Number(resp.headers.get("X-Duration-Seconds") || "300");

        let useMSE = !!window.MediaSource;
        if (mime === originalMime && originalSize > 10 * 1024 * 1024) {
            // if audio is not transcoded, check whether file size exceeds the limit
            useMSE = false;
        } else if (mime !== originalMime && duration > 10 * 60) {
            // if audio is transcoded and duration > 10 minutes, do not use MSE
            useMSE = false;
        }

        const result = {
            useMSE,
            duration,
            url,
        };

        if (useMSE) {
            const mediaSource = new MediaSource();
            mediaSource.addEventListener("sourceopen", () => {
                fetch(url, { cache: "force-cache" }).then((resp) => {
                    // set source buffer mime type
                    const sourceBuffer = mediaSource.addSourceBuffer(mime);
                    let isSourceRemoved = false;

                    // set media source duration
                    mediaSource.duration = duration;

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
                    sourceBuffer.addEventListener("updateend", () =>
                        reader?.read().then(appendBuffer)
                    );

                    // read body once
                    reader?.read().then(appendBuffer);
                });
            });
            result.url = URL.createObjectURL(mediaSource);
        }
        return result;
    });
}

export default function usePlayer() {
    const player = useRecoilValue(PlayerState);
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    const setNowPlayingInfo = useSetRecoilState(NowPlayingInfoState);
    const play = useCallback(
        async ({
            playUrl,
            title,
            artist,
            albumTitle,
            albumId,
            coverUrl,
            discId,
            trackId,
        }: PlayQueueItem) => {
            if (!playUrl) {
                return;
            }
            setPlayerStatus(PlayerStatus.BUFFERING);
            // TODO: make use of audioInfo.useMSE and audioInfo.duration
            const audioInfo = await getAudioUrl(playUrl);
            player.src = audioInfo.url;
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
                        discId,
                        trackId,
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
    const mute = useCallback(() => {
        player.muted = true;
    }, [player]);
    const unmute = useCallback(() => {
        player.muted = false;
    }, [player]);
    return [
        player,
        {
            play,
            resume,
            restart,
            pause,
            setVolume,
            seek,
            mute,
            unmute,
        },
    ] as const;
}
