import React from "react";
import { Grid, IconButton, Tooltip } from "@material-ui/core";
import { QueueMusic } from "@material-ui/icons";
import styles from "./index.module.scss";

const PlayerPlaylist: React.FC = () => {
    return (
        <Grid container alignItems="center" className={styles.container}>
            <Tooltip title="暂未实现">
                <IconButton color="inherit">
                    <QueueMusic />
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

export default PlayerPlaylist;
