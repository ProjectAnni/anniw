import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { Grid, Typography } from "@mui/material";
import useMessage from "@/hooks/useMessage";
import { CredentialState } from "@/state/credentials";
import CommonPagination from "@/components/Pagination";
import AlbumWall from "@/components/AlbumWall";
import { getLibraryAlbums } from "./services";
import "./index.scss";

interface LibraryInfo {
    url: string;
    token: string;
}

const AlbumList: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [libraryInfo, setLibraryInfo] = useState<LibraryInfo | null>(null);
    const [albums, setAlbums] = useState<string[]>([]);
    const { credentials } = useRecoilValue(CredentialState);
    const [_, { addMessage }] = useMessage();

    useEffect(() => {
        const libraryUrl = searchParams.get("url");
        if (!libraryUrl) {
            addMessage("error", "请指定音频仓库 URL");
            return;
        }
        const sessionLibraryInfo = credentials.find((item) => item.url === libraryUrl);
        if (!sessionLibraryInfo) {
            addMessage("error", "未找到指定的音频仓库");
            navigate("/library");
            return;
        }
        setLibraryInfo({
            url: libraryUrl,
            token: sessionLibraryInfo.token,
        });
        getLibraryAlbums(libraryUrl).then((albums) => {
            setAlbums(albums);
        });
    }, [searchParams, addMessage, credentials, navigate]);

    return (
        <Grid container justifyContent="center" className="album-list-page-container">
            <Grid item xs={12}>
                <Typography variant="h4" className="title">
                    专辑列表
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <CommonPagination<string> items={albums}>
                    {({ items }) => <AlbumWall albums={items} libraryInfo={libraryInfo} />}
                </CommonPagination>
            </Grid>
        </Grid>
    );
};

export default AlbumList;
