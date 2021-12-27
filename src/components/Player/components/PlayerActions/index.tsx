import React, { useRef, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { Grid, IconButton, Tooltip } from "@mui/material";
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
    const volumeBarRef = useRef<HTMLDivElement>(null);
    const [isShowVolumeTip, setIsShowVolumeTip] = useState(false);
    const [volumeTipLeft, setVolumeTipLeft] = useState(0);
    const history = useHistory();
    const volumeTipText = useMemo(() => {
        if (!volumeBarRef.current) {
            return;
        }
        const { width } = volumeBarRef.current.getBoundingClientRect();
        const percent = volumeTipLeft / width;
        return `${Math.round(percent * 100)}%`;
    }, [volumeTipLeft]);
    const onClickLoopMode = () => {
        onChangeLoopMode(LoopModeNextMap[loopMode]);
    };
    const onClickVolumeBar = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!volumeBarRef.current) {
            return;
        }
        const { width, left } = volumeBarRef.current.getBoundingClientRect();
        const percent = ((e.clientX - left) / width) * 100;
        setVolume(percent);
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
                <div
                    ref={volumeBarRef}
                    className={styles.volumeBar}
                    onClick={onClickVolumeBar}
                    onMouseEnter={() => {
                        setIsShowVolumeTip(true);
                    }}
                    onMouseLeave={() => {
                        setIsShowVolumeTip(false);
                    }}
                    onMouseMove={(e) => {
                        volumeBarRef.current &&
                            setVolumeTipLeft(
                                e.clientX - volumeBarRef.current.getBoundingClientRect().left
                            );
                    }}
                >
                    <div
                        className={styles.filled}
                        style={{
                            width: isMute ? "0%" : `${currentVolume}%`,
                        }}
                    />
                    {isShowVolumeTip && (
                        <div
                            className={styles.volumeTip}
                            style={{
                                left: volumeTipLeft,
                            }}
                        >
                            {volumeTipText}
                        </div>
                    )}
                </div>
            </div>
        </Grid>
    );
};

export default PlayerActions;
