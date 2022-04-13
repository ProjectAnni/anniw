import React, { memo } from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { InheritedAlbumDetail } from "@/types/common";
import Tag from "@/components/Tag";
import Artist from "@/components/Artist";
import Placeholder from "./Placeholder";
import styles from "./index.module.scss";

interface Props {
    albumInfo?: InheritedAlbumDetail;
    onPlayAlbum: () => void;
}

const AlbumBasicInfo: React.FC<Props> = (props) => {
    const { albumInfo } = props;
    const { title, artist, date, catalog, edition, tags = [] } = albumInfo || {};
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
                <Tooltip title="播放全部">
                    <IconButton onClick={props.onPlayAlbum}>
                        <PlayArrow />
                    </IconButton>
                </Tooltip>
            </div>
        </Grid>
    );
};

export default memo(AlbumBasicInfo);
