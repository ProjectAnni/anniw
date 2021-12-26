import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { QueueMusic, Repeat, RepeatOne, Shuffle } from "@mui/icons-material";
import styles from "./index.module.scss";
import { LoopMode, LoopModeNextMap } from "../../types";

interface Props {
    loopMode: LoopMode;
    onChangeLoopMode: (mode: LoopMode) => void;
}

const PlayerActions: React.FC<Props> = (props) => {
    const { loopMode, onChangeLoopMode } = props;
    const history = useHistory();
    const onClickLoopMode = () => {
        onChangeLoopMode(LoopModeNextMap[loopMode]);
    };
    return (
        <Grid container alignItems="center" className={styles.container}>
            {loopMode === LoopMode.LIST_LOOP && (
                <Tooltip title="队列循环">
                    <IconButton color="inherit" onClick={onClickLoopMode}>
                        <Repeat />
                    </IconButton>
                </Tooltip>
            )}
            {loopMode === LoopMode.TRACK_LOOP && (
                <Tooltip title="单曲循环">
                    <IconButton color="inherit" onClick={onClickLoopMode}>
                        <RepeatOne />
                    </IconButton>
                </Tooltip>
            )}
            {loopMode === LoopMode.SHUFFLE && (
                <Tooltip title="队列随机">
                    <IconButton color="inherit" onClick={onClickLoopMode}>
                        <Shuffle />
                    </IconButton>
                </Tooltip>
            )}
            <Tooltip title="播放队列">
                <IconButton
                    color="inherit"
                    onClick={() => {
                        history.push("/queue");
                    }}
                >
                    <QueueMusic />
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

export default PlayerActions;
