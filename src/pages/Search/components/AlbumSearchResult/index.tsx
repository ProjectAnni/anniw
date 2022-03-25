import React, { useEffect, useState } from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
import AlbumWall from "@/components/AlbumWall";
import { AlbumInfo } from "@/types/common";
import useMessage from "@/hooks/useMessage";
import { searchAlbums } from "../../services";
import styles from "./index.module.scss";

interface Props {
    keyword: string;
}

const AlbumSearchResult: React.FC<Props> = (props) => {
    const { keyword } = props;
    const [isSearching, setIsSearching] = useState(false);
    const [isNoResult, setIsNoResult] = useState(false);
    const [albumResult, setAlbumResult] = useState<AlbumInfo[]>([]);
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        (async () => {
            setIsSearching(true);
            setAlbumResult([]);
            try {
                const { albums = [] } = await searchAlbums({ keyword });
                if (albums.length === 0) {
                    setIsNoResult(true);
                } else {
                    setIsNoResult(false);
                    setAlbumResult(albums);
                }
            } catch (e) {
                if (e instanceof Error) {
                    addMessage("error", e.message);
                }
            } finally {
                setIsSearching(false);
            }
        })();
    }, [addMessage, keyword]);
    return (
        <>
            <Grid item xs={12} className={styles.searchResultContainer}>
                <AlbumWall albums={Array.from(albumResult, (a) => a.albumId)} />
            </Grid>
            {isSearching && (
                <Grid item xs={12} className={styles.loadingContainer}>
                    <CircularProgress color="inherit" className={styles.loading} />
                </Grid>
            )}
            {!isSearching && isNoResult && (
                <Grid item xs={12} className={styles.noResultContainer}>
                    <Typography variant="body1">无搜索结果</Typography>
                </Grid>
            )}
        </>
    );
};

export default AlbumSearchResult;
