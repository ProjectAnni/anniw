import React, { useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import TrackList from "@/components/TrackList";
import { TrackListFeatures } from "@/components/TrackList/types";
import { FavoriteTracksState } from "@/state/favorite";
import { PlayQueueItem } from "@/types/common";

const Favorite = () => {
    const favoriteTracks = useRecoilValue(FavoriteTracksState);
    const parsedFavoriteTracks = useMemo<PlayQueueItem[]>(
        () =>
            // TODO: 无 info 项处理
            favoriteTracks
                .filter((t) => !!t.info)
                .map((t) => ({
                    ...t,
                    ...t.info!,
                    trackIndex: t.trackId - 1,
                    discIndex: t.discId - 1,
                })),
        [favoriteTracks]
    );
    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    我喜欢的音乐
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList
                    tracks={parsedFavoriteTracks}
                    itemIndex={0}
                    features={[TrackListFeatures.SHOW_FAVORITE_ICON]}
                />
            </Grid>
        </Grid>
    );
};

export default Favorite;