import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { QueueMusic, Repeat, RepeatOne } from "@mui/icons-material";
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
                <Tooltip title="列表循环">
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
            <Tooltip title="播放列表">
                <IconButton
                    color="inherit"
                    onClick={() => {
                        history.push("/playlist");
                    }}
                >
                    <QueueMusic />
                </IconButton>
            </Tooltip>
        </Grid>
    );
};

export default PlayerActions;
