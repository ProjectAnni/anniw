import { useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { NowPlayingInfoState, PlayerState, PlayerStatusState } from "@/state/player";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import useLocalStorageValue from "./useLocalStorageValue";

const audioInfoCache = new Map();

async function getAudioUrl(url: string, quality?: string) {
    try {
        const audioUrl = MediaSource.isTypeSupported("audio/aac")
            ? `${url}${quality ? `&quality=${quality}` : ""}`
            : `${url}&quality=lossless`;
        const resp = audioInfoCache.has(audioUrl)
            ? audioInfoCache.get(audioUrl)
            : await fetch(audioUrl, { method: "HEAD" });
        audioInfoCache.set(audioUrl, resp);
        const mime = resp.headers.get("Content-Type") || "audio/aac";
        const originalMime = resp.headers.get("X-Origin-Type") || "audio/flac";
        const duration = Number(resp.headers.get("X-Duration-Seconds") || "300");

        let useMSE = !!window.MediaSource && MediaSource.isTypeSupported(mime);
        if (mime === originalMime) {
            // if audio is lossless, prefer direct URL
            useMSE = false;
        } else if (mime !== originalMime && duration > 10 * 60) {
            // if audio is transcoded and duration > 10 minutes, do not use MSE
            useMSE = false;
        }

        const result = {
            useMSE,
            duration,
            url: audioUrl,
        };

        if (useMSE) {
            const mediaSource = new MediaSource();
            mediaSource.addEventListener("sourceopen", () => {
                fetch(audioUrl, { cache: "force-cache" }).then((resp) => {
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
    } catch (e) {
        return { url };
    }
}

export default function usePlayer() {
    const player = useRecoilValue(PlayerState);
    const [quality] = useLocalStorageValue("player.quality", "lossless");
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
            const audioInfo = await getAudioUrl(playUrl, quality);
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
        [player, quality, setPlayerStatus, setNowPlayingInfo]
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
    const preload = useCallback(
        ({ playUrl }: PlayQueueItem) => {
            if (!playUrl) {
                return;
            }
            return getAudioUrl(playUrl, quality);
        },
        [quality]
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
            mute,
            unmute,
            preload,
        },
    ] as const;
}
