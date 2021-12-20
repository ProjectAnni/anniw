import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, IconButton } from "@material-ui/core";
import { QueueMusic } from "@material-ui/icons";
import styles from "./index.module.scss";

const PlayerPlaylist: React.FC = () => {
    const history = useHistory();
    return (
        <Grid container alignItems="center" className={styles.container}>
            <IconButton
                color="inherit"
                onClick={() => {
                    history.push("/playlist");
                }}
            >
                <QueueMusic />
            </IconButton>
        </Grid>
    );
};

export default PlayerPlaylist;
