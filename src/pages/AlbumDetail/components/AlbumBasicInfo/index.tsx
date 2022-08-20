import React, { memo, useCallback, useMemo, useState } from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { PlayArrow, Share } from "@mui/icons-material";
import {
    InheritedAlbumDetail,
    InheritedDiscDetail,
    TrackInfo,
    TrackInfoWithAlbum,
} from "@/types/common";
import Tag from "@/components/Tag";
import Artist from "@/components/Artist";
import ShareDialog from "@/components/ShareDialog";
import Placeholder from "./Placeholder";
import styles from "./index.module.scss";

interface Props {
    albumInfo?: InheritedAlbumDetail;
    onPlayAlbum: () => void;
}

const AlbumBasicInfo: React.FC<Props> = (props) => {
    const { albumInfo } = props;
    const { title, artist, date, catalog, edition, tags = [] } = albumInfo || {};
    const [isShowShareDialog, setIsShowShareDialog] = useState(false);
    const allTracks = useMemo<TrackInfoWithAlbum[]>(() => {
        const { discs, albumId, title } = albumInfo || {};
        if (!discs?.length || !albumId || !title) {
            return [];
        }
        return discs
            .map((disc: InheritedDiscDetail, discIndex) =>
                disc.tracks.map((track: Required<TrackInfo>, trackIndex) => ({
                    ...track,
                    albumId: albumId,
                    albumTitle: title,
                    discId: discIndex + 1,
                    trackId: trackIndex + 1,
                }))
            )
            .flat();
    }, [albumInfo]);
    const onShareCancel = useCallback(() => {
        setIsShowShareDialog(false);
    }, []);
    if (!albumInfo) {
        return <Placeholder />;
    }
    return (
        <Grid container flexDirection="column" className={styles.basicInfoContainer}>
            <Typography variant="h4" className={styles.titleContainer}>
                <span title={title}>{title}</span>
            </Typography>
            <div className={styles.releaseDate}>
                {catalog} / {date}
                {edition ? ` / ${edition}` : ""}
            </div>
            <div className={styles.artist}>{!!artist && <Artist artist={artist} />}</div>
            <div className={styles.tagsContainer}>
                {tags.map((tag) => (
                    <Tag key={tag} tag={tag} />
                ))}
            </div>
            <div className={styles.actions}>
                <Tooltip title="分享">
                    <IconButton
                        onClick={() => {
                            setIsShowShareDialog(true);
                        }}
                    >
                        <Share />
                    </IconButton>
                </Tooltip>
                <Tooltip title="播放全部">
                    <IconButton onClick={props.onPlayAlbum}>
                        <PlayArrow />
                    </IconButton>
                </Tooltip>
            </div>
            <ShareDialog
                open={isShowShareDialog}
                tracks={allTracks}
                defaultName={title}
                onCancel={onShareCancel}
            />
        </Grid>
    );
};

export default memo(AlbumBasicInfo);
