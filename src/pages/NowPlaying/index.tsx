import React, { memo, useRef } from "react";
// import { chunk } from "lodash";
import { useRecoilValue } from "recoil";
import { Grid, Typography } from "@mui/material";
import { NowPlayingInfoState } from "@/state/player";
import Cover from "@/components/Cover";
import styles from "./index.module.scss";
import TrackInfo from "./components/TrackInfo";

const NowPlaying: React.FC = () => {
    const pageContainerRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const nowPlayingInfo = useRecoilValue(NowPlayingInfoState);
    const { coverUrl, title } = nowPlayingInfo;
    const onCoverLoaded = (coverUrl: string) => {
        // const el = document.createElement("img");
        // const canvas = document.createElement("canvas");
        // const ctx = canvas.getContext("2d");
        // if (!ctx) {
        //     return;
        // }
        // el.src = coverUrl;
        // el.addEventListener("load", () => {
        //     canvas.width = el.width || el.naturalWidth;
        //     canvas.height = el.height || el.naturalHeight;
        //     ctx.drawImage(el, 0, 0);
        //     if (!canvas.width || !canvas.height) {
        //         return;
        //     }
        //     const rgba = ctx.getImageData(0, 0, el.width, el.height).data;
        //     const averageColor = chunk(rgba, 4)
        //         .reduce(
        //             (acc, [r, g, b, a]) => {
        //                 acc[0] += r;
        //                 acc[1] += g;
        //                 acc[2] += b;
        //                 acc[3] += a;
        //                 return acc;
        //             },
        //             [0, 0, 0, 0]
        //         )
        //         .map((v) => Math.round((v / rgba.length) * 4));
        //     console.log(averageColor);
        //     // if (pageContainerRef.current) {
        //     //     pageContainerRef.current.style.backgroundColor = `rgba(${averageColor.join(",")})`;
        //     // }
        // });
        if (backgroundRef.current) {
            backgroundRef.current.style.backgroundImage = `url(${coverUrl})`;
        }
    };
    return (
        <Grid
            container
            justifyContent="center"
            className={styles.pageContainer}
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
