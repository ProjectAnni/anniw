import React, { useCallback, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Button, Grid, Typography } from "@mui/material";
import { CredentialState } from "@/state/credentials";
import useMessage from "@/hooks/useMessage";
import { AnnilToken } from "@/types/common";
import { default as LibraryDB } from "@/db/library";
import LibraryList from "./components/LibraryList";
import AddLibraryDialog from "./components/AddLibraryFormDialog";
import DeleteLibraryDialog from "./components/DeleteLibraryDialog";
import "./index.scss";

const Library: React.FC = () => {
    const [currentClickedLibrary, setCurrentClickedLibrary] = useState<AnnilToken | null>(null);
    const [isShowAddLibraryDialog, setIsShowAddLibraryDialog] = useState(false);
    const [isShowDeleteLibraryDialog, setIsShowDeleteLibraryDialog] = useState(false);
    const [credentials, setCredentials] = useRecoilState(CredentialState);
    const { credentials: libraries } = credentials;
    const [_, { addMessage }] = useMessage();
    const navigate = useNavigate();
    const onLibraryDeleted = useCallback(
        async (deletedLibrary: AnnilToken) => {
            const { id } = deletedLibrary;
            setCredentials((prev) => {
                return {
                    credentials: prev.credentials.filter((c) => c.id !== id),
                };
            });
            setIsShowDeleteLibraryDialog(false);
        },
        [setCredentials]
    );
    const onLibraryAdded = useCallback(
        (createdAnnilToken: AnnilToken) => {
            setCredentials((prev) => {
                return {
                    credentials: [...prev.credentials, createdAnnilToken],
                };
            });
            setIsShowAddLibraryDialog(false);
        },
        [setCredentials]
    );
    const onLibraryClicked = useCallback(
        async (library: AnnilToken) => {
            const { url } = library;
            const libraryInfo = await LibraryDB.get(url);
            if (!libraryInfo || !libraryInfo.albums?.length) {
                addMessage("error", "请先同步一次该音频仓库");
                return;
            }
            navigate(`/album/list?url=${encodeURI(url)}`);
        },
        [navigate, addMessage]
    );

    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    音频仓库
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                <LibraryList
                    libraries={libraries}
                    onClick={onLibraryClicked}
                    onDelete={(library) => {
                        setIsShowDeleteLibraryDialog(true);
                        setCurrentClickedLibrary(library);
                    }}
                />
            </Grid>
            <Grid item xs={12} lg={8} textAlign="right">
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        setIsShowAddLibraryDialog(true);
                    }}
                >
                    添加音频仓库
                </Button>
            </Grid>
            <AddLibraryDialog
                open={isShowAddLibraryDialog}
                onCancel={() => {
                    setIsShowAddLibraryDialog(false);
                }}
                onAdded={onLibraryAdded}
            />
            <DeleteLibraryDialog
                open={isShowDeleteLibraryDialog}
                currentLibrary={currentClickedLibrary}
                onCancel={() => {
                    setIsShowDeleteLibraryDialog(false);
                }}
                onDeleted={onLibraryDeleted}
            />
        </Grid>
    );
};

export default Library;
