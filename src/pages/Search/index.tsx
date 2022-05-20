import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Grid, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import SearchBox from "./components/SearchBox";
import styles from "./index.module.scss";
import { SearchType } from "./types";
import AlbumSearchResult from "./components/AlbumSearchResult";
import TrackSearchResult from "./components/TrackSearchResult";

const Search = () => {
    const [searchType, setSearchType] = useState<SearchType>(SearchType.TRACK);
    const [keyword, setKeyword] = useState("");
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const keyword = searchParams.get("keyword");
        if (keyword) {
            setKeyword(keyword);
        }
    }, [searchParams]);
    return (
        <Grid container justifyContent="center">
            <Grid item xs={12} className={styles.searchBoxContainer}>
                <Grid container justifyContent="center">
                    <Grid item>
                        <SearchBox />
                    </Grid>
                </Grid>
            </Grid>
            {!!keyword && (
                <Grid item xs={12}>
                    <TabContext value={searchType}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList
                                value={searchType}
                                onChange={(e, value) => {
                                    setSearchType(value);
                                }}
                            >
                                <Tab label="单曲" value={SearchType.TRACK} />
                                <Tab label="专辑" value={SearchType.ALBUM} />
                            </TabList>
                        </Box>
                        <TabPanel value={SearchType.TRACK}>
                            <TrackSearchResult keyword={keyword} />
                        </TabPanel>
                        <TabPanel value={SearchType.ALBUM}>
                            <AlbumSearchResult keyword={keyword} />
                        </TabPanel>
                    </TabContext>
                </Grid>
            )}
        </Grid>
    );
};

export default Search;
