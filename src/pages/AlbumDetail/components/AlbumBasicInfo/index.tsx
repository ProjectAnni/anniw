import React, { memo } from "react";
import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { AlbumInfo } from "@/types/common";
import styles from "./index.module.scss";
import Tag from "@/components/Tag";

interface Props {
    albumInfo?: AlbumInfo;
    onPlayAlbum: () => void;
}

const AlbumBasicInfo: React.FC<Props> = (props) => {
    const { albumInfo } = props;
    const { title, artist, date, catalog, type, tags = [] } = albumInfo || {};
    return (
        <Grid container flexDirection="column" className={styles.basicInfoContainer}>
            <Typography variant="h4" className={styles.titleContainer}>
                <span title={title}>{title}</span>
            </Typography>
            <div className={styles.releaseDate}>
                {catalog} / {date} / {type}
            </div>
            <div className={styles.artist}>{artist}</div>
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
