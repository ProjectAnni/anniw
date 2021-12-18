import React from "react";
import { useRecoilValue } from "recoil";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import PreviousIcon from "@material-ui/icons/SkipPrevious";
import NextIcon from "@material-ui/icons/SkipNext";
import usePlayer from "@/hooks/usePlayer";
import { PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";

const PlayerController: React.FC = () => {
    const playerStatus = useRecoilValue(PlayerStatusState);
    const [player, { resume, pause }] = usePlayer();
    return (
        <>
            <IconButton color="inherit" aria-label="menu" onClick={() => {}}>
                <PreviousIcon />
            </IconButton>
            <IconButton
                color="inherit"
                aria-label="menu"
                onClick={() => {
                    if (playerStatus === PlayerStatus.PLAYING) {
                        pause();
                    } else {
                        resume();
                    }
                }}
            >
                {playerStatus === PlayerStatus.PAUSED ? (
                    <PlayIcon fontSize="large" />
                ) : (
                    <PauseIcon fontSize="large" />
                )}
            </IconButton>
            <IconButton color="inherit" aria-label="menu" onClick={() => {}}>
                <NextIcon />
            </IconButton>
        </>
    );
};

export default PlayerController;
