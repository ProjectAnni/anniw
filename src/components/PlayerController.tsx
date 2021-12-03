import React from "react";
import { atom, useRecoilValue } from "recoil";

import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import PreviousIcon from "@material-ui/icons/SkipPrevious";
import NextIcon from "@material-ui/icons/SkipNext";

const PlayState = atom<AnniwPlayState>({
    key: "PlayState",
    default: {
        currentSong: null,
        isPlaying: false,
    },
});

export const PlayerController: React.FC = () => {
    const state = useRecoilValue(PlayState);
    return (
        <>
            <IconButton color="inherit" aria-label="menu" onClick={() => {}}>
                <PreviousIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="menu" onClick={() => {}}>
                {state.isPlaying ? <PauseIcon fontSize="large" /> : <PlayIcon fontSize="large" />}
            </IconButton>
            <IconButton color="inherit" aria-label="menu" onClick={() => {}}>
                <NextIcon />
            </IconButton>
        </>
    );
};

interface AnniwPlayState {
    currentSong: MusicIndex | null;
    isPlaying: boolean;
}
