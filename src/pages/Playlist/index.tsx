import React from "react";
import { Grid, Typography } from "@material-ui/core";
import usePlaylist from "@/hooks/usePlaylist";
import TrackList from "@/components/TrackList";

const Playlist = () => {
    const [playlist] = usePlaylist();
    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    播放列表
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList tracks={playlist} />
            </Grid>
        </Grid>
    );
};

export default Playlist;
