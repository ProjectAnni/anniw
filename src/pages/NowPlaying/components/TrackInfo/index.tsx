import React from "react";
import { useRecoilValue } from "recoil";
import { Typography } from "@mui/material";
import { NowPlayingInfoState } from "@/state/player";
import styles from "./index.module.scss";

const TrackInfo: React.FC = () => {
    const { title, artist } = useRecoilValue(NowPlayingInfoState);
    if (!title) {
        return null;
    }
    return (
        <div className={styles.info}>
            <div className={styles.title}>
                <Typography variant="h4">{title}</Typography>
            </div>
            <div className={styles.artist}>{artist}</div>
        </div>
    );
};

export default TrackInfo;
