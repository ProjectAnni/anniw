import React from "react";
import { Grid, Typography } from "@mui/material";
import CommonPagination from "@/components/Pagination";
import AlbumWall from "@/components/AlbumWall";
import { FavoriteAlbumsState } from "@/state/favorite";
import { useRecoilValue } from "recoil";

const FavoriteAlbum = () => {
    const albums = useRecoilValue(FavoriteAlbumsState);
    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    我喜欢的专辑
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                <CommonPagination<string> items={albums}>
                    {({ items }) => <AlbumWall albums={items} />}
                </CommonPagination>
            </Grid>
        </Grid>
    );
};

export default FavoriteAlbum;
