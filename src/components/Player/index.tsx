import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Grid } from "@material-ui/core";
import storage from "@/utils/storage";
import usePlayer from "@/hooks/usePlayer";
import usePlayerController from "@/hooks/usePlayerController";
import usePlaylist from "@/hooks/usePlaylist";
import { PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";
import PlayerCover from "./components/PlayerCover";
import PlayerController from "./components/PlayerController";
import PlayerProgress from "./components/PlayerProgress";
import PlayerPlaylist from "./components/PlayerPlaylist";

const Player: React.FC = () => {
    const [player, { restart, resume, pause }] = usePlayer();
    const [playlist] = usePlaylist();
    const { playNext, replacePlaylist } = usePlayerController();
    const [playerStatus, setPlayerStatus] = useRecoilState(PlayerStatusState);
    useEffect(() => {
        const onEnded = () => {
            setPlayerStatus(PlayerStatus.ENDED);
            playNext();
        };
        player.addEventListener("ended", onEnded);
        return () => {
            player.removeEventListener("ended", onEnded);
        };
    }, [player, playNext, setPlayerStatus]);
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
        if (playlist.length > 0) {
            storage.set("playlist", playlist);
        }
    }, [playlist]);
    useEffect(() => {
        const localPlaylist = storage.get("playlist");
        if (localPlaylist?.length) {
            replacePlaylist(localPlaylist);
        }
    }, [replacePlaylist]);
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
                <PlayerPlaylist />
            </Grid>
        </Grid>
    );
};

export default Player;
