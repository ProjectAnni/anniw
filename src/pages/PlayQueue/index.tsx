import React from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import usePlayQueue from "@/hooks/usePlayQueue";
import usePlayerController from "@/hooks/usePlayQueueController";
import TrackList from "@/components/TrackList";
import { TrackItemType, TrackListFeatures } from "@/components/TrackList/types";

const PlayQueue = () => {
    const [playQueue] = usePlayQueue();
    const { clearPlayQueue, removeFromPlayQueue } = usePlayerController();
    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    播放队列
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8} textAlign="right">
                <Tooltip title="清空播放队列">
                    <IconButton onClick={clearPlayQueue}>
                        <Delete />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item xs={12} lg={8}>
                <TrackList
                    tracks={playQueue.map((item) => ({ ...item, itemType: TrackItemType.NORMAL }))}
                    itemIndex={0}
                    features={[
                        TrackListFeatures.SHOW_PLAY_QUEUE_REMOVE_ICON,
                        TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
                    ]}
                    onPlayQueueRemove={(track) => {
                        removeFromPlayQueue(track);
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default PlayQueue;
