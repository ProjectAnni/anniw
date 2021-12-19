import React from "react";
import { Grid } from "@material-ui/core";
import PlayerCover from './components/PlayerCover';
import PlayerController from "./components/PlayerController";
import PlayerProgress from "./components/PlayerProgress";
import PlayerPlaylist from "./components/PlayerPlaylist";

const Player: React.FC = () => {
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
