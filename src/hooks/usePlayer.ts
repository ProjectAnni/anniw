import { useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { NowPlayingInfoState, PlayerDurationState, PlayerState, PlayerStatusState } from "@/state/player";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import { addQueries } from "@/utils/url";
import useLocalStorageValue from "./useLocalStorageValue";

interface AudioPlayInfo {
    duration?: number;
    url: string;
    useMSE: boolean;
}

async function getAudioPlayInfo(url: string, quality?: string): Promise<AudioPlayInfo> {
    const audioUrl = addQueries(url, {
        quality:
            !!window.MediaSource && MediaSource.isTypeSupported("audio/aac")
                ? quality ?? ""
                : "lossless",
        _xcw: "1", // cache flag
    });
    const useMSE = (() => {
        if (!window.MediaSource) {
            // MediaSource is not supported by browser.
            return false;
        }
        if (!window.MediaSource.isTypeSupported("audio/aac")) {
            // Transcoded audio is in aac format.
            return false;
        }
        return true;
    })();

    if (!useMSE) {
        return { url: audioUrl, useMSE };
    }

    let resolveAudioPlayInfo: (info: AudioPlayInfo) => void;

    const mediaSource = new MediaSource();

    fetch(audioUrl, { cache: "force-cache", mode: "cors" }).then((resp) => {
        const duration = resp.headers.get("x-duration-seconds")!;
        const mime = resp.headers.get("content-type")!;

        if (!duration || !mime) {
            // Missing necessary headers to use MediaSource, fallback
            resolveAudioPlayInfo({ url, useMSE: false });
            return;
        }

        if (!MediaSource.isTypeSupported(mime)) {
            resolveAudioPlayInfo({ url, useMSE: false, duration: +duration });
            return;
        }

        resolveAudioPlayInfo({
            url: URL.createObjectURL(mediaSource),
            duration: +duration,
            useMSE,
        });

        mediaSource.addEventListener("sourceopen", () => {
            // set source buffer mime type
            const sourceBuffer = mediaSource.addSourceBuffer(mime);
            let isSourceRemoved = false;

            // set media source duration
            mediaSource.duration = +duration;

            // get body as reader
            const reader = resp.body?.getReader();
            const appendBuffer = ({ done, value }: ReadableStreamReadResult<Uint8Array>) => {
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

    return new Promise((resolve) => {
        resolveAudioPlayInfo = resolve;
    });
}

export default function usePlayer() {
    const player = useRecoilValue(PlayerState);
    const [playerDuration, setPlayerDuration] = useRecoilState(PlayerDurationState);
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
            // TODO: make use of audioInfo.useMSE
            const audioInfo = await getAudioPlayInfo(playUrl, quality);
            player.src = audioInfo.url;
            player.addEventListener(
                "canplay",
                () => {
                    player.play();
                    setPlayerStatus(PlayerStatus.PLAYING);
                    if(!!audioInfo.duration) setPlayerDuration(+audioInfo.duration);
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
        async ({ playUrl }: PlayQueueItem) => {
            if (!playUrl) {
                return;
            }
            const finalUrl = await getAudioPlayInfo(playUrl, quality);
            let preloadAudioEl: HTMLAudioElement | null = new Audio(finalUrl.url);
            preloadAudioEl.addEventListener("canplay", () => {
                preloadAudioEl = null;
            });
            return finalUrl;
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
