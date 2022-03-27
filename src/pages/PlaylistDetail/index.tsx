import React, { useMemo, useCallback, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Divider, Grid } from "@mui/material";
import useRequest from "@/hooks/useRequest";
import usePlayQueueController from "@/hooks/usePlayQueueController";
import useMessage from "@/hooks/useMessage";
import { TrackItem, TrackItemType, TrackListFeatures } from "@/components/TrackList/types";
import TrackList from "@/components/TrackList";
import { isSameTrack } from "@/utils/library";
import { Playlist, PlaylistSong, PlaylistSongNormal, PlayQueueItem } from "@/types/common";
import { queryPlaylistDetail, deleteTrackFromPlaylist } from "./services";
import styles from "./index.module.scss";
import PlaylistCover from "./components/PlaylistCover";
import PlaylistInfo from "./components/PlaylistInfo";

const isNormalPlaylistSong = (item: PlaylistSong): item is PlaylistSongNormal =>
    item.type === "normal";

const PlaylistDetail: React.FC = () => {
    const { id: playlistId } = useParams<{ id: string }>();
    const [playlistResponse] = useRequest(() => queryPlaylistDetail(playlistId));
    const [playlist, setPlaylist] = useState<Playlist>();
    const { addToPlayQueue, addToLater } = usePlayQueueController();
    const [_, { addMessage }] = useMessage();
    const { songs = [] } = playlist || {};
    useEffect(() => {
        if (playlistResponse) {
            setPlaylist(playlistResponse);
        }
    }, [playlistResponse]);
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
    const onPlaylistRemove = useCallback(
        async (track: PlayQueueItem) => {
            try {
                const deleteTrack = songs
                    .filter(isNormalPlaylistSong)
                    .find((song) => isSameTrack(song, track));
                if (deleteTrack) {
                    const response = await deleteTrackFromPlaylist(playlistId, deleteTrack.id);
                    setPlaylist(response);
                    addMessage("success", "删除成功");
                }
            } catch (e) {
                if (e instanceof Error) {
                    addMessage("error", e.message);
                }
            }
        },
        [addMessage, playlistId, songs]
    );
    return (
        <Grid container justifyContent="center" className={styles.pageContainer}>
            <Grid item xs={12} lg={8}>
                <Grid container spacing={2}>
                    <Grid item xs={12} lg={3}>
                        <PlaylistCover playlist={playlist} />
                    </Grid>
                    <Grid item xs={12} lg={9}>
                        <PlaylistInfo
                            playlist={playlist}
                            onPlaylistInfoUpdate={(playlist) => {
                                setPlaylist(playlist);
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={8} className={styles.divider}>
                <Divider />
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList
                    tracks={tracks}
                    features={[
                        TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
                        TrackListFeatures.SHOW_ADD_TO_LATER,
                        TrackListFeatures.SHOW_FAVORITE_ICON,
                        TrackListFeatures.SHOW_PLAY_QUEUE_REMOVE_ICON,
                    ]}
                    itemIndex={1}
                    onPlayQueueAdd={onPlayQueueAdd}
                    onPlayQueueAddToLater={onPlayQueueAddToLater}
                    onPlayQueueRemove={onPlaylistRemove}
                />
            </Grid>
        </Grid>
    );
};

export default PlaylistDetail;
