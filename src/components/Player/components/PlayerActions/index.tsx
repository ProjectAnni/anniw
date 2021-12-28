import React from "react";
import { useHistory } from "react-router-dom";
import { Grid, IconButton, Slider, Tooltip } from "@mui/material";
import { QueueMusic, Repeat, RepeatOne, Shuffle, VolumeOff, VolumeUp } from "@mui/icons-material";
import { LoopMode, LoopModeNextMap } from "../../types";
import styles from "./index.module.scss";

interface Props {
    loopMode: LoopMode;
    isMute: boolean;
    currentVolume: number;
    setVolume: (volume: number) => void;
    onChangeLoopMode: (mode: LoopMode) => void;
    onVolumeButtonClick: () => void;
}

const PlayerActions: React.FC<Props> = (props) => {
    const { loopMode, isMute, currentVolume, setVolume, onChangeLoopMode, onVolumeButtonClick } =
        props;
    const history = useHistory();
    const onClickLoopMode = () => {
        onChangeLoopMode(LoopModeNextMap[loopMode]);
    };
    const handleVolumeChange = (e: Event, value: number | number[]) => {
        setVolume(value as number);
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
            <Tooltip title={isMute ? "解除静音" : "静音"}>
                <IconButton color="inherit" onClick={onVolumeButtonClick}>
                    {isMute ? <VolumeOff /> : <VolumeUp />}
                </IconButton>
            </Tooltip>
            <div className={styles.volumeBarContainer}>
                <Slider value={currentVolume} onChange={handleVolumeChange} valueLabelDisplay="auto" color="secondary" />
            </div>
        </Grid>
    );
};

export default PlayerActions;
