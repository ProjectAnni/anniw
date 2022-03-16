import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import useRequest from "@/hooks/useRequest";
import usePlayQueueController from "@/hooks/usePlayQueueController";
import { TrackItem, TrackItemType, TrackListFeatures } from "@/components/TrackList/types";
import TrackList from "@/components/TrackList";
import { PlaylistSong, PlaylistSongNormal, PlayQueueItem } from "@/types/common";
import { queryPlaylistDetail } from "./services";
import styles from "./index.module.scss";

const isNormalPlaylistSong = (item: PlaylistSong): item is PlaylistSongNormal =>
    item.type === "normal";

const PlaylistDetail: React.FC = () => {
    const { id: playlistId } = useParams<{ id: string }>();
    const [playlistDetail] = useRequest(() => queryPlaylistDetail(+playlistId));
    const { addToPlayQueue, addToLater } = usePlayQueueController();
    const { name, description, songs = [] } = playlistDetail || {};
    const tracks = useMemo<TrackItem[]>(() => {
        if (!songs?.length) {
            return [];
        }
        return songs.filter(isNormalPlaylistSong).map((item: PlaylistSongNormal) => ({
            ...item,
            itemType: TrackItemType.NORMAL,
        }));
    }, [songs]);
    const onPlayQueueAdd = useCallback(
        (track: PlayQueueItem) => {
            addToPlayQueue(track);
        },
        [addToPlayQueue]
    );
    const onPlayQueueAddToLater = useCallback(
        (track: PlayQueueItem) => {
            addToLater(track);
        },
        [addToLater]
    );
    return (
        <Grid container justifyContent="center" className={styles.pageContainer}>
            <Grid item xs={12} lg={8}>
                <Grid container flexDirection="column">
                    <Grid item xs={12}>
                        <Typography variant="h4" className="title">
                            {name}
                        </Typography>
                    </Grid>
                    {!!description && (
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" className={styles.description}>
                                {name}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList
                    tracks={tracks}
                    features={[
                        TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
                        TrackListFeatures.SHOW_ADD_TO_LATER,
                        TrackListFeatures.SHOW_FAVORITE_ICON,
                    ]}
                    itemIndex={1}
                    onPlayQueueAdd={onPlayQueueAdd}
                    onPlayQueueAddToLater={onPlayQueueAddToLater}
                />
            </Grid>
        </Grid>
    );
};

export default PlaylistDetail;
