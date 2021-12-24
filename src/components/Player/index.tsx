import React, { useEffect, useState } from "react";
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
    const [player, { restart, resume, pause }] = usePlayer();
    const [playQueue] = usePlayQueue();
    const { playNext, playRandom, replacePlayQueue } = usePlayerController();
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    useEffect(() => {
        const onEnded = () => {
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
        };
        player.addEventListener("ended", onEnded);
        return () => {
            player.removeEventListener("ended", onEnded);
        };
    }, [player, playNext, setPlayerStatus, loopMode, restart, playRandom]);
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
    const onChangeLoopMode = (mode: LoopMode) => {
        setLoopMode(mode);
    }
    return (
        <Grid container>
            <Grid item flexShrink={0}>
                <PlayerCover />
            </Grid>
            <Grid item flexShrink={0}>
                <PlayerController />
            </Grid>
            <Grid item flexGrow={1}>
                <PlayerProgress />
            </Grid>
            <Grid item flexShrink={0}>
                <PlayerActions loopMode={loopMode} onChangeLoopMode={onChangeLoopMode} />
            </Grid>
        </Grid>
    );
};

export default Player;
