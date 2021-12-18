import React from "react";
import { Grid } from "@material-ui/core";
import PlayerController from "./components/PlayerController";
import PlayerProgress from "./PlayerProgress";

const Player: React.FC = () => {
    return (
        <Grid container>
            <Grid item flexShrink={0}>
                <PlayerController />
            </Grid>
            <Grid item flexGrow={1}>
                <PlayerProgress />
            </Grid>
        </Grid>
    );
};

export default Player;
