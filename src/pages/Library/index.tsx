import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useHistory } from "react-router-dom";
import { Button, Grid, Typography } from "@material-ui/core";
import { CredentialState } from "@/state/credentials";
import useRequest from "@/hooks/useRequest";
import useMessage from "@/hooks/useMessage";
import Loading from "@/components/Loading";
import { AnnilToken } from "@/types/common";
import { default as LibraryDB } from "@/db/library";
import { getAvailableAnnilTokens } from "./services";
import LibraryList from "./components/LibraryList";
import AddLibraryDialog from "./components/AddLibraryFormDialog";
import SyncLibraryDialog from "./components/LibrarySyncDialog";
import DeleteLibraryDialog from "./components/DeleteLibraryDialog";
import "./index.scss";

const Library: React.FC = () => {
    const [currentClickedLibrary, setCurrentClickedLibrary] = useState<AnnilToken | null>(null);
    const [isShowAddLibraryDialog, setIsShowAddLibraryDialog] = useState(false);
    const [isShowSyncLibraryDialog, setIsShowSyncLibraryDialog] = useState(false);
    const [isShowDeleteLibraryDialog, setIsShowDeleteLibraryDialog] = useState(false);
    const [localInfoRefreshIndicator, setLocalInfoRefreshIndicator] = useState(0);
    const [availableTokens, loading] = useRequest(getAvailableAnnilTokens);
    const [credentials, setCredentials] = useRecoilState(CredentialState);
    const [_, { addMessage }] = useMessage();
    const history = useHistory();
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
    const onLibrarySyncEnded = useCallback(async () => {
        if (!currentClickedLibrary) {
            return;
        }
        setLocalInfoRefreshIndicator((prev) => prev + 1);
        setIsShowSyncLibraryDialog(false);
    }, [currentClickedLibrary]);
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
            history.push(`/album/list/?url=${encodeURI(url)}`);
        },
        [history, addMessage]
    );
    useEffect(() => {
        if (availableTokens?.length) {
            setCredentials({
                credentials: availableTokens,
            });
        }
    }, [availableTokens, setCredentials]);
    return (
        <Grid container justifyContent="center" className="library-page-container">
            <Grid item xs={12} lg={8}>
                <Typography variant="h4" className="title">
                    音频仓库
                </Typography>
            </Grid>
            <Grid item xs={12} lg={8}>
                {loading ? (
                    <Loading />
                ) : (
                    <LibraryList
                        libraries={credentials.credentials}
                        localInfoRefreshIndicator={localInfoRefreshIndicator}
                        onClick={onLibraryClicked}
                        onSync={(library) => {
                            setIsShowSyncLibraryDialog(true);
                            setCurrentClickedLibrary(library);
                        }}
                        onDelete={(library) => {
                            setIsShowDeleteLibraryDialog(true);
                            setCurrentClickedLibrary(library);
                        }}
                    />
                )}
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
            <SyncLibraryDialog
                open={isShowSyncLibraryDialog}
                onCancel={() => {
                    setIsShowSyncLibraryDialog(false);
                }}
                currentLibrary={currentClickedLibrary}
                onSyncEnded={onLibrarySyncEnded}
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
