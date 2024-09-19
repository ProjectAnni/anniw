import React, { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { Grid } from "@mui/material";
import storage from "@/utils/storage";
import usePlayer from "@/hooks/usePlayer";
import usePlayerController from "@/hooks/usePlayQueueController";
import usePlayQueue from "@/hooks/usePlayQueue";
import useLocalStorageValue from "@/hooks/useLocalStorageValue";
import useTitle from "@/hooks/useTitle";
import useMediaSession from "@/hooks/useMediaSession";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { PlayerStatus, PlayQueueItem } from "@/types/common";
import PlayerCover from "./components/PlayerCover";
import PlayerController from "./components/PlayerController";
import PlayerProgress from "./components/PlayerProgress";
import PlayerActions from "./components/PlayerActions";
import PlayerBackground from "./components/PlayerBackground";
import { recordTrackPlayback } from "./services";
import { PLAYBACK_RECORD_DELAY } from "./constants";
import { LoopMode } from "./types";

const Player: React.FC = () => {
    const [loopMode, setLoopMode] = useState<LoopMode>(LoopMode.LIST_LOOP);
    const [isMute, setIsMute] = useState(false);
    const [volume, setVolume] = useLocalStorageValue("player.volume", "100");
    const [player, { restart, resume, pause, mute, unmute, setVolume: setPlayerVolume }] =
        usePlayer();
    const [playQueue] = usePlayQueue();
    const { playPrev, playNext, playRandom, playIndex, replacePlayQueue } = usePlayerController();
    const { updateTitleWithSiteName } = useTitle();
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    const [nowPlayingInfo, setNowPlayingInfo] = useRecoilState(NowPlayingInfoState);

    const onChangeLoopMode = (mode: LoopMode) => {
        setLoopMode(mode);
    };

    const onVolumeButtonClick = () => {
        isMute ? unmute() : mute();
        setIsMute((prevIsMute) => !prevIsMute);
    };

    const onPlayPrev = useCallback(() => {
        playPrev();
    }, [playPrev]);

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

    const onMediaSessionPrevTrack = useCallback(() => {
        onPlayPrev();
    }, [onPlayPrev]);

    useEffect(() => {
        player.addEventListener("ended", onPlayNext);
        return () => {
            player.removeEventListener("ended", onPlayNext);
        };
    }, [player, onPlayNext]);

    useMediaSession({
        onPrevTrack: onMediaSessionPrevTrack,
        onNextTrack: onMediaSessionNextTrack,
        onPause: onMediaSessionPause,
        onPlay: onMediaSessionPlay,
    });

    useEffect(() => {
        const { title } = nowPlayingInfo || {};
        title && updateTitleWithSiteName(title);
    }, [nowPlayingInfo, updateTitleWithSiteName]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            const { albumId, discId, trackId } = nowPlayingInfo || {};
            if (albumId && discId && trackId && playerStatus === PlayerStatus.PLAYING) {
                recordTrackPlayback({
                    track: {
                        albumId,
                        discId,
                        trackId,
                    },
                    at: [Math.round((Math.round(Date.now()) - PLAYBACK_RECORD_DELAY) / 1000)],
                });
            }
        }, PLAYBACK_RECORD_DELAY);
        return () => {
            clearTimeout(timer);
        };
    }, [nowPlayingInfo, playerStatus]);

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
        setPlayerVolume(+volume / 100);
    }, [player, setPlayerVolume, volume]);

    return (
        <Grid container>
            <Grid item flexShrink={0}>
                <PlayerCover />
            </Grid>
            <Grid item flexShrink={0}>
                <PlayerController
                    playPrev={onPlayPrev}
                    playNext={onPlayNext}
                    playFirst={onPlayFirst}
                />
            </Grid>
            <Grid item flexGrow={1}>
                <PlayerProgress />
            </Grid>
            <Grid item flexShrink={0}>
                <PlayerActions
                    loopMode={loopMode}
                    isMute={isMute}
                    currentVolume={+volume}
                    setVolume={(v) => {
                        setVolume(v.toString());
                    }}
                    onChangeLoopMode={onChangeLoopMode}
                    onVolumeButtonClick={onVolumeButtonClick}
                />
            </Grid>
            <PlayerBackground />
        </Grid>
    );
};

export default Player;
