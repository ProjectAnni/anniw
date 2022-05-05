import React from "react";
import { useRecoilValue } from "recoil";
import { Grid, CircularProgress } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import PrevIcon from "@mui/icons-material/SkipPrevious"
import NextIcon from "@mui/icons-material/SkipNext";
import usePlayer from "@/hooks/usePlayer";
import { PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";

interface Props {
    playPrev: () => void;
    playNext: () => void;
    playFirst: () => void;
}

const PlayerController: React.FC<Props> = (props) => {
    const { playPrev, playNext, playFirst } = props;
    const playerStatus = useRecoilValue(PlayerStatusState);
    const [player, { resume, pause, restart }] = usePlayer();
    return (
        <Grid container alignItems="center" sx={{ height: "100%" }}>
            <IconButton
                color="inherit"
                aria-label="menu"
                onClick={() => {
                    if (playerStatus === PlayerStatus.PLAYING) {
                        pause();
                    } else if (playerStatus === PlayerStatus.ENDED) {
                        restart();
                    } else if (playerStatus === PlayerStatus.PAUSED) {
                        resume();
                    } else if (playerStatus === PlayerStatus.EMPTY) {
                        playFirst();
                    }
                }}
            >
                <>
                    {(playerStatus === PlayerStatus.PAUSED ||
                        playerStatus === PlayerStatus.ENDED ||
                        playerStatus === PlayerStatus.EMPTY) && <PlayIcon fontSize="large" />}
                    {playerStatus === PlayerStatus.PLAYING && <PauseIcon fontSize="large" />}
                    {playerStatus === PlayerStatus.BUFFERING && (
                        <CircularProgress color="inherit" size="35px" />
                    )}
                </>
            </IconButton>
            <IconButton color="inherit" aria-label="menu" onClick={playPrev}>
                <PrevIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="menu" onClick={playNext}>
                <NextIcon />
            </IconButton>
        </Grid>
    );
};

export default PlayerController;
