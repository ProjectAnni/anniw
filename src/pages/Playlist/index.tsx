import React from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { PlaylistRemove } from "@mui/icons-material";
import usePlaylist from "@/hooks/usePlaylist";
import usePlayerController from "@/hooks/usePlaylistController";
import TrackList from "@/components/TrackList";

const Playlist = () => {
    const [playlist] = usePlaylist();
    const { clearPlaylist } = usePlayerController();
    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    播放列表
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8} textAlign="right">
                <Tooltip title="清空播放列表">
                    <IconButton onClick={clearPlaylist}>
                        <PlaylistRemove />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList tracks={playlist} itemIndex={0} />
            </Grid>
        </Grid>
    );
};

export default Playlist;
