import React from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { PlaylistRemove } from "@mui/icons-material";
import usePlaylist from "@/hooks/usePlaylist";
import TrackList from "@/components/TrackList";
import usePlayerController from "@/hooks/usePlayerController";

const Playlist = () => {
    const [playlist] = usePlaylist();
    const { clear } = usePlayerController();
    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    播放列表
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8} textAlign="right">
                <Tooltip title="清空播放列表">
                    <IconButton onClick={clear}>
                        <PlaylistRemove />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList tracks={playlist} />
            </Grid>
        </Grid>
    );
};

export default Playlist;
