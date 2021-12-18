import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { AlbumInfo, AnnilToken } from "@/types/common";
import styles from "./index.module.scss";

interface Props {
    albumInfo?: AlbumInfo;
    credential?: AnnilToken;
}

const AlbumBasicInfo: React.FC<Props> = (props) => {
    const { albumInfo, credential } = props;
    const { title, artist, date, catalog, edition, type, tags = [] } = albumInfo || {};
    return (
        <Grid container flexDirection="column">
            <Typography variant="h3" className={styles.titleContainer}>
                <span title={title}>{title}</span>
            </Typography>
            <div className={styles.releaseDate}>
                {catalog} / {date}
                {`${edition ? ` / ${edition}` : ""}`} / {type}
            </div>
            <div className={styles.artist}>{artist}</div>
            <div className={styles.tagsContainer}>
                {tags.map((tag) => (
                    <div key={tag} className={styles.tag}>
                        {tag}
                    </div>
                ))}
            </div>
        </Grid>
    );
};

export default AlbumBasicInfo;
