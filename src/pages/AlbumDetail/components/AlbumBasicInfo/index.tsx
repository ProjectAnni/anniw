import React from "react";
import { Grid, IconButton, Tooltip, Typography } from "@material-ui/core";
import { Sync } from "@material-ui/icons";
import { AlbumInfo, AnnilToken } from "@/types/common";
import { deleteAlbumInfoCache } from "../../services";
import styles from "./index.module.scss";

interface Props {
    albumInfo?: AlbumInfo;
    credential?: AnnilToken;
}

const AlbumBasicInfo: React.FC<Props> = (props) => {
    const { albumInfo } = props;
    const { title, artist, date, catalog, type, tags = [] } = albumInfo || {};
    const onRefresh = async () => {
        await deleteAlbumInfoCache(albumInfo?.albumId);
        location.reload();
    };
    return (
        <Grid container flexDirection="column" className={styles.basicInfoContainer}>
            <Typography variant="h3" className={styles.titleContainer}>
                <span title={title}>{title}</span>
            </Typography>
            <div className={styles.releaseDate}>
                {catalog} / {date} / {type}
            </div>
            <div className={styles.artist}>{artist}</div>
            <div className={styles.tagsContainer}>
                {tags.map((tag) => (
                    <div key={tag} className={styles.tag}>
                        {tag}
                    </div>
                ))}
            </div>
            <div className={styles.actions}>
                <Tooltip title="刷新元信息">
                    <IconButton onClick={onRefresh}>
                        <Sync />
                    </IconButton>
                </Tooltip>
            </div>
        </Grid>
    );
};

export default AlbumBasicInfo;
