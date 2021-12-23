import React from "react";
import { Grid } from "@mui/material";
import Item from "./Item";
import styles from "./index.module.scss";

interface Props {
    albums: string[];
    libraryInfo?: {
        url: string;
        token: string;
    } | null;
}

const AlbumWall: React.FC<Props> = (props) => {
    const { albums = [], libraryInfo } = props;
    return (
        <Grid container className={styles.wallContainer} wrap="wrap">
            {albums.map((albumId) => (
                <Item albumId={albumId} libraryInfo={libraryInfo} key={albumId} />
            ))}
        </Grid>
    );
};

export default AlbumWall;
