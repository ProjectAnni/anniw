import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Grid, MenuItem, Pagination, Select, Typography } from "@material-ui/core";
import useQuery from "@/hooks/useQuery";
import useMessage from "@/hooks/useMessage";
import { CredentialState } from "@/state/credentials";
import { getLibraryAlbums } from "./services";
import AlbumWall from "./components/AlbumWall";
import "./index.scss";

interface LibraryInfo {
    url: string;
    token: string;
}

const AlbumList: React.FC = () => {
    const albumListRef = useRef<HTMLDivElement>(null);
    const [libraryInfo, setLibraryInfo] = useState<LibraryInfo | null>(null);
    const [albums, setAlbums] = useState<string[]>([]);
    const [pageNum, setPageNum] = useState<number>(1);
    const [itemPerPage, setItemPerPage] = useState<number>(30);
    const { credentials } = useRecoilValue(CredentialState);
    const query = useQuery();
    const [_, { addMessage }] = useMessage();
    const history = useHistory();
    useEffect(() => {
        const libraryUrl = query.get("url");
        if (!libraryUrl) {
            addMessage("error", "请指定音频仓库 URL");
            return;
        }
        const sessionLibraryInfo = credentials.find((item) => item.url === libraryUrl);
        if (!sessionLibraryInfo) {
            addMessage("error", "未找到指定的音频仓库");
            history.push("/library");
            return;
        }
        setLibraryInfo({
            url: libraryUrl,
            token: sessionLibraryInfo.token,
        });
        getLibraryAlbums(libraryUrl).then((albums) => {
            setAlbums(albums);
        });
    }, [query, addMessage, credentials, history]);
    const pageCount = useMemo(
        () => Math.floor(albums.length / itemPerPage) + 1,
        [albums, itemPerPage]
    );
    const paginatedAlbums = useMemo(() => {
        const start = (pageNum - 1) * itemPerPage;
        const end = start + itemPerPage;
        return albums.slice(start, end);
    }, [albums, pageNum, itemPerPage]);

    return (
        <Grid
            container
            justifyContent="center"
            className="album-list-page-container"
            ref={albumListRef}
        >
            <Grid item xs={12}>
                <Typography variant="h4" className="title">
                    专辑列表
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {paginatedAlbums.length > 0 && (
                    <AlbumWall albums={paginatedAlbums} libraryInfo={libraryInfo} />
                )}
            </Grid>
            <Grid
                item
                xs={12}
                textAlign="right"
                sx={{
                    margin: "20px 0",
                }}
            >
                <Grid container alignItems="center">
                    <Select
                        label="每页数量"
                        value={itemPerPage}
                        onChange={(e) => {
                            setItemPerPage(+e.target.value);
                        }}
                        size="small"
                    >
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                    <Pagination
                        page={pageNum}
                        count={pageCount}
                        color="primary"
                        onChange={(e, page) => {
                            setPageNum(page);
                            albumListRef.current && albumListRef.current.scrollIntoView();
                        }}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AlbumList;
