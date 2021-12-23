import React, { useCallback, useEffect, useState } from "react";
import { CircularProgress, Grid, Typography } from "@mui/material";
import SearchBox from "./components/SearchBox";
import styles from "./index.module.scss";
import { searchAlbums } from "./services";
import useMessage from "@/hooks/useMessage";
import useQuery from "@/hooks/useQuery";
import { AlbumInfo } from "@/types/common";
import AlbumWall from "@/components/AlbumWall";

const Search = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [isNoResult, setIsNoResult] = useState(false);
    const [albumResult, setAlbumResult] = useState<AlbumInfo[]>([]);
    const [_, { addMessage }] = useMessage();
    const query = useQuery();
    const onSearch = useCallback(async (keyword: string) => {
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
    }, [addMessage]);
    useEffect(() => {
        const keyword = query.get("keyword");
        if (keyword) {
            onSearch(keyword);
        }
    }, [onSearch, query])
    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} className={styles.searchBoxContainer}>
                <Grid container justifyContent="center">
                    <Grid item>
                        <SearchBox />
                    </Grid>
                </Grid>
            </Grid>
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
        </Grid>
    );
};

export default Search;
