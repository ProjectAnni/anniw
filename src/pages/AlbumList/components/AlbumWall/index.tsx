import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import Item from "./Item";
import "./index.scss";

interface Props {
    albums: string[];
    libraryInfo: {
        url: string;
        token: string;
    } | null;
}

const AlbumWall: React.FC<Props> = (props) => {
    const { albums = [], libraryInfo } = props;
    return (
        <Grid container className="album-wall-container" wrap="wrap">
            {albums.map((albumId) => (
                <Item albumId={albumId} libraryInfo={libraryInfo} key={albumId} />
            ))}
        </Grid>
    );
};

export default AlbumWall;
