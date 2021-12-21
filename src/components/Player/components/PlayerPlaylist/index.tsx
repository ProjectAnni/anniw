import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, IconButton } from "@mui/material";
import { QueueMusic } from "@mui/icons-material";
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
