import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Grid, Typography } from "@mui/material";
import useRequest from "@/hooks/useRequest";
import { TrackItem, TrackItemType, TrackListFeatures } from "@/components/TrackList/types";
import { PlaylistSong, PlaylistSongNormal } from "@/types/common";
import { queryPlaylistDetail } from "./services";
import styles from "./index.module.scss";
import TrackList from "@/components/TrackList";

const isNormalPlaylistSong = (item: PlaylistSong): item is PlaylistSongNormal =>
    item.type === "normal";

const PlaylistDetail: React.FC = () => {
    const { id: playlistId } = useParams<{ id: string }>();
    const [playlistDetail] = useRequest(() => queryPlaylistDetail(+playlistId));
    const { name, songs = [] } = playlistDetail || {};
    const tracks = useMemo<TrackItem[]>(() => {
        if (!songs?.length) {
            return [];
        }
        return songs.filter(isNormalPlaylistSong).map((item: PlaylistSongNormal) => ({
            ...item,
            itemType: TrackItemType.NORMAL,
        }));
    }, [songs]);
    return (
        <Grid container justifyContent="center" className={styles.pageContainer}>
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    {name}
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList
                    tracks={tracks}
                    features={[
                        TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
                        // TrackListFeatures.SHOW_ADD_TO_LATER,
                        TrackListFeatures.SHOW_FAVORITE_ICON,
                        // TrackListFeatures.SHOW_PLAY_QUEUE_ADD_ICON,
                        // TrackListFeatures.SHOW_PLAY_QUEUE_REMOVE_ICON,
                    ]}
                    itemIndex={1}
                />
            </Grid>
        </Grid>
    );
};

export default PlaylistDetail;
