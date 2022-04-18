import React, { useMemo } from "react";
import { Grid, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import TrackList from "@/components/TrackList";
import { TrackItemType, TrackListFeatures } from "@/components/TrackList/types";
import { FavoriteTracksState } from "@/state/favorite";
import { PlayQueueItem } from "@/types/common";

const Favorite = () => {
    const favoriteTracks = useRecoilValue(FavoriteTracksState);
    const parsedFavoriteTracks = useMemo<PlayQueueItem[]>(
        () =>
            // TODO: 无 info 项处理
            favoriteTracks
                // .filter((t) => !!t.info)
                .map((t) => ({
                    tags: [],
                    ...t,
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
                    tracks={parsedFavoriteTracks.map((track) => ({
                        ...track,
                        itemType: TrackItemType.NORMAL,
                    }))}
                    itemIndex={0}
                    features={[
                        TrackListFeatures.SHOW_FAVORITE_ICON,
                        TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
                        TrackListFeatures.SHOW_ADD_TO_LATER,
                    ]}
                />
            </Grid>
        </Grid>
    );
};

export default Favorite;
