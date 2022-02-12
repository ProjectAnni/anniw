import React, { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { Grid } from "@mui/material";
import storage from "@/utils/storage";
import usePlayer from "@/hooks/usePlayer";
import usePlayerController from "@/hooks/usePlayQueueController";
import usePlayQueue from "@/hooks/usePlayQueue";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import PlayerCover from "./components/PlayerCover";
import PlayerController from "./components/PlayerController";
import PlayerProgress from "./components/PlayerProgress";
import PlayerActions from "./components/PlayerActions";
import { LoopMode } from "./types";

const Player: React.FC = () => {
    const [loopMode, setLoopMode] = useState<LoopMode>(LoopMode.LIST_LOOP);
    const [isMute, setIsMute] = useState(false);
    const [volume, setVolume] = useState(100);
    const [player, { restart, resume, pause, mute, unmute, setVolume: setPlayerVolume }] =
        usePlayer();
    const [playQueue] = usePlayQueue();
    const { playNext, playRandom, playIndex, replacePlayQueue } = usePlayerController();
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    const [nowPlayingInfo, setNowPlayingInfo] = useRecoilState(NowPlayingInfoState);
    const onChangeLoopMode = (mode: LoopMode) => {
        setLoopMode(mode);
    };
    const onVolumeButtonClick = () => {
        isMute ? unmute() : mute();
        setIsMute((prevIsMute) => !prevIsMute);
    };
    const onPlayNext = useCallback(() => {
        if (loopMode === LoopMode.LIST_LOOP) {
            setPlayerStatus(PlayerStatus.ENDED);
            playNext();
        }
        if (loopMode === LoopMode.TRACK_LOOP) {
            restart();
        }
        if (loopMode === LoopMode.SHUFFLE) {
            playRandom();
        }
    }, [loopMode, playNext, playRandom, restart, setPlayerStatus]);
    const onPlayFirst = useCallback(() => {
        playIndex(0);
    }, [playIndex]);
    const onMediaSessionPlay = useCallback(() => {
        if (playerStatus === PlayerStatus.ENDED) {
            restart();
        } else {
            resume();
        }
    }, [playerStatus, restart, resume]);
    const onMediaSessionPause = useCallback(() => {
        pause();
    }, [pause]);
    const onMediaSessionNextTrack = useCallback(() => {
        onPlayNext();
    }, [onPlayNext]);
    useEffect(() => {
        player.addEventListener("ended", onPlayNext);
        return () => {
            player.removeEventListener("ended", onPlayNext);
        };
    }, [player, playNext, setPlayerStatus, loopMode, restart, playRandom, onPlayNext]);
    useEffect(() => {
        if ("mediaSession" in window.navigator) {
            if (playerStatus === PlayerStatus.PLAYING) {
                navigator.mediaSession.playbackState = "playing";
            } else if (playerStatus === PlayerStatus.PAUSED) {
                navigator.mediaSession.playbackState = "paused";
            }
        }
    }, [playerStatus]);
    useEffect(() => {
        if (
            "mediaSession" in window.navigator &&
            !!nowPlayingInfo.title &&
            nowPlayingInfo.title !== navigator.mediaSession.metadata?.title
        ) {
            window.navigator.mediaSession.metadata = new MediaMetadata({
                title: nowPlayingInfo.title,
                artist: nowPlayingInfo.artist,
                album: nowPlayingInfo.albumTitle,
                ...(nowPlayingInfo.coverUrl
                    ? {
                          artwork: [
                              {
                                  src: nowPlayingInfo.coverUrl,
                                  sizes: "512x512",
                                  type: "image/jpeg",
                              },
                          ],
                      }
                    : {}),
            });
            navigator.mediaSession.setActionHandler("play", onMediaSessionPlay);
            navigator.mediaSession.setActionHandler("pause", onMediaSessionPause);
            navigator.mediaSession.setActionHandler("nexttrack", onMediaSessionNextTrack);
        }
    }, [nowPlayingInfo, onMediaSessionNextTrack, onMediaSessionPause, onMediaSessionPlay]);
    useEffect(() => {
        if (playQueue.length > 0) {
            storage.set("playlist", playQueue);
        }
    }, [playQueue]);
    useEffect(() => {
        const localPlayQueue = storage.get<PlayQueueItem[]>("playlist");
        if (localPlayQueue?.length) {
            replacePlayQueue(localPlayQueue);
            setNowPlayingInfo(localPlayQueue[0]);
        }
    }, [replacePlayQueue, setNowPlayingInfo]);
    useEffect(() => {
        setPlayerVolume(volume / 100);
    }, [player, setPlayerVolume, volume]);
    return (
        <Grid container>
            <Grid item flexShrink={0}>
                <PlayerCover />
            </Grid>
            <Grid item flexShrink={0}>
                <PlayerController playNext={onPlayNext} playFirst={onPlayFirst} />
            </Grid>
            <Grid item flexGrow={1}>
                <PlayerProgress />
            </Grid>
            <Grid item flexShrink={0}>
                <PlayerActions
                    loopMode={loopMode}
                    isMute={isMute}
                    currentVolume={volume}
                    setVolume={setVolume}
                    onChangeLoopMode={onChangeLoopMode}
                    onVolumeButtonClick={onVolumeButtonClick}
                />
            </Grid>
        </Grid>
    );
};

export default Player;
