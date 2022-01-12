import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { Grid, Typography } from "@mui/material";
import { PlaylistInfo } from "@/types/common";
import { PlaylistsState } from "@/state/playlists";
import PlaylistList from "./components/PlaylistList";
import PlaylistDeleteDialog from "./components/PlaylistDeleteDialog";
import styles from "./index.module.scss";

const Playlist: React.FC = () => {
    const [isShowPlaylistDeleteDialog, setIsShowPlaylistDeleteDialog] = useState(false);
    const [playlist, setPlaylist] = useState<PlaylistInfo | null>(null);
    const setPlaylists = useSetRecoilState(PlaylistsState);
    const onPlaylistDeleted = () => {
        if (!playlist) {
            return;
        }
        setIsShowPlaylistDeleteDialog(false);
        setPlaylists((playlists) => playlists.filter((p) => p.id !== playlist.id));
    };
    return (
        <Grid container justifyContent="center" className={styles.pageContainer}>
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    播放列表管理
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                <PlaylistList
                    onDelete={(playlist) => {
                        setPlaylist(playlist);
                        setIsShowPlaylistDeleteDialog(true);
                    }}
                />
            </Grid>
            <PlaylistDeleteDialog
                playlist={playlist}
                open={isShowPlaylistDeleteDialog}
                onCancel={() => {
                    setIsShowPlaylistDeleteDialog(false);
                }}
                onDeleted={onPlaylistDeleted}
            />
        </Grid>
    );
};

export default Playlist;
