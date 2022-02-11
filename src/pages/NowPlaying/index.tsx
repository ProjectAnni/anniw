import React, { memo, useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import classnames from "classnames";
import { Grid } from "@mui/material";
import { NowPlayingInfoState } from "@/state/player";
import Cover from "@/components/Cover";
import styles from "./index.module.scss";
import TrackInfo from "./components/TrackInfo";
import { DrawerIsOpen } from "@/state/ui";

const NowPlaying: React.FC = () => {
    const pageContainerRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const nowPlayingInfo = useRecoilValue(NowPlayingInfoState);
    const isDrawerOpen = useRecoilValue(DrawerIsOpen);
    const { coverUrl } = nowPlayingInfo;
    const onCoverLoaded = useCallback((coverUrl: string) => {
        if (backgroundRef.current) {
            backgroundRef.current.style.backgroundImage = `url(${coverUrl})`;
        }
    }, []);
    return (
        <Grid
            container
            justifyContent="center"
            className={classnames(styles.pageContainer, {
                [styles.withDrawerOpen]: isDrawerOpen,
            })}
            ref={pageContainerRef}
        >
            <div className={styles.background} ref={backgroundRef}></div>
            <Grid item xs={10}>
                <Grid container spacing={2} className={styles.body}>
                    <Grid item xs={12} lg={5} className={styles.left}>
                        <div className={styles.coverContainer}>
                            <Cover coverUrl={coverUrl} onLoaded={onCoverLoaded} />
                        </div>
                    </Grid>
                    <Grid item xs={12} lg={7} className={styles.right}>
                        <TrackInfo />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default memo(NowPlaying);
