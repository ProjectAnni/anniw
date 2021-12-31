import React, { useEffect, useState, useCallback } from "react";
import { useRecoilState } from "recoil";
import { Grid } from "@mui/material";
import storage from "@/utils/storage";
import usePlayer from "@/hooks/usePlayer";
import usePlayerController from "@/hooks/usePlayQueueController";
import usePlayQueue from "@/hooks/usePlayQueue";
import { PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";
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
    const { playNext, playRandom, replacePlayQueue } = usePlayerController();
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    const onChangeLoopMode = (mode: LoopMode) => {
        setLoopMode(mode);
    };
    const onVolumeButtonClick = () => {
        isMute ? unmute() : mute();
        setIsMute((prevIsMute) => !prevIsMute);
    };
    const next = useCallback(() => {
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
    useEffect(() => {
        player.addEventListener("ended", next);
        return () => {
            player.removeEventListener("ended", next);
        };
    }, [player, playNext, setPlayerStatus, loopMode, restart, playRandom, next]);
    useEffect(() => {
        if ("mediaSession" in window.navigator) {
            if (playerStatus === PlayerStatus.PLAYING) {
                navigator.mediaSession.playbackState = "playing";
            } else if (playerStatus === PlayerStatus.PAUSED) {
                navigator.mediaSession.playbackState = "paused";
            }
            navigator.mediaSession.setActionHandler("play", () => {
                if (playerStatus === PlayerStatus.ENDED) {
                    restart();
                } else {
                    resume();
                }
            });
            navigator.mediaSession.setActionHandler("pause", pause);
            navigator.mediaSession.setActionHandler("nexttrack", next);
        }
    }, [pause, playerStatus, restart, resume, next]);
    useEffect(() => {
        if (playQueue.length > 0) {
            storage.set("playlist", playQueue);
        }
    }, [playQueue]);
    useEffect(() => {
        const localPlayQueue = storage.get("playlist");
        if (localPlayQueue?.length) {
            replacePlayQueue(localPlayQueue);
        }
    }, [replacePlayQueue]);
    useEffect(() => {
        setPlayerVolume(volume / 100);
    }, [player, setPlayerVolume, volume]);
    return (
        <Grid container>
            <Grid item flexShrink={0}>
                <PlayerCover />
            </Grid>
            <Grid item flexShrink={0}>
                <PlayerController playNext={next} />
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
