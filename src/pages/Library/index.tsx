import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Grid, Typography } from "@material-ui/core";
import { CredentialState } from "@/state/credentials";
import useRequest from "@/hooks/useRequest";
import useMessage from "@/hooks/useMessage";
import { default as LibraryDB } from "@/db/library";
import { default as AlbumDB } from "@/db/album";
import Loading from "@/components/Loading";
import { AnnilToken } from "@/types/common";
import {
    getAvailableAnnilTokens,
    deleteAnnilToken,
    createAnnilToken,
    getLibraryInfo,
    getLibraryAlbums,
} from "./services";
import LibraryList from "./components/LibraryList";
import AddLibraryFormDialog from "./components/AddLibraryFormDialog";
import LibrarySyncDialog from "./components/LibrarySyncDialog";
import "./index.scss";

const Library: React.FC = () => {
    const [currentClickedLibrary, setCurrentClickedLibrary] = useState<AnnilToken | null>(null);
    const [isShowAddLibraryForm, setIsShowAddLibraryForm] = useState(false);
    const [isShowLibrarySyncDialog, setIsShowLibrarySyncDialog] = useState(false);
    const [isAddLibrarySubmitting, setIsAddLibrarySubmitting] = useState(false);
    const [isLibrarySyncLoading, setIsLibrarySyncLoading] = useState(false);
    const [localInfoRefreshIndicator, setLocalInfoRefreshIndicator] = useState(0);
    const [availableTokens, loading] = useRequest(getAvailableAnnilTokens);
    const [credentials, setCredentials] = useRecoilState(CredentialState);
    const [_, { addMessage }] = useMessage();
    const onLibraryDelete = useCallback(
        async (library: AnnilToken) => {
            const { id } = library;
            try {
                await deleteAnnilToken(id);
                setCredentials((prev) => {
                    return {
                        credentials: prev.credentials.filter((c) => c.id !== id),
                    };
                });
            } catch (e) {
                if (e instanceof Error) {
                    addMessage("error", e.message);
                }
            }
        },
        [addMessage, setCredentials]
    );
    const onLibrarySync = useCallback(async () => {
        if (!currentClickedLibrary) {
            return;
        }
        setIsShowLibrarySyncDialog(true);
        setIsLibrarySyncLoading(true);
        try {
            const libraryInfo = await getLibraryInfo(currentClickedLibrary);
            const { lastUpdate } = libraryInfo;
            const albums = await getLibraryAlbums(currentClickedLibrary);
            if (albums?.length > 0) {
                for (const albumId of albums) {
                    await AlbumDB.addAvailableLibrary(albumId, currentClickedLibrary.url);
                }
            }
            await LibraryDB.set({
                url: currentClickedLibrary.url,
                serverLastUpdate: new Date(lastUpdate * 1000),
                lastSync: new Date(),
            });
            setLocalInfoRefreshIndicator((prev) => prev + 1);
        } catch (e) {
            if (e instanceof Error) {
                addMessage("error", e.message);
            }
        } finally {
            addMessage("success", "音频仓库同步成功");
            setIsLibrarySyncLoading(false);
            setIsShowLibrarySyncDialog(false);
        }
    }, [addMessage, currentClickedLibrary]);
    const handleAddLibraryFormSubmit = useCallback(
        async ({ name, url, token, priority }: Omit<AnnilToken, "id">) => {
            setIsAddLibrarySubmitting(true);
            try {
                const createdAnnilToken = await createAnnilToken({
                    name,
                    url,
                    token,
                    priority,
                });
                setCredentials((prev) => {
                    return {
                        credentials: [...prev.credentials, createdAnnilToken],
                    };
                });
            } catch (e) {
                if (e instanceof Error) {
                    addMessage("error", e.message);
                }
            } finally {
                setIsAddLibrarySubmitting(false);
                setIsShowAddLibraryForm(false);
            }
        },
        [addMessage, setCredentials]
    );
    useEffect(() => {
        if (availableTokens?.length) {
            setCredentials({
                credentials: availableTokens,
            });
        }
    }, [availableTokens, setCredentials]);
    return (
        <Grid container className="library-page-container">
            <Grid item xs={12}>
                <Typography variant="h4" className="title">
                    音频仓库
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {loading ? (
                    <Loading />
                ) : (
                    <LibraryList
                        libraries={credentials.credentials}
                        localInfoRefreshIndicator={localInfoRefreshIndicator}
                        onSync={(library) => {
                            setIsShowLibrarySyncDialog(true);
                            setCurrentClickedLibrary(library);
                        }}
                        onDelete={onLibraryDelete}
                    />
                )}
            </Grid>
            <Grid container justifyContent="right">
                <Grid item>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            setIsShowAddLibraryForm(true);
                        }}
                    >
                        添加音频仓库
                    </Button>
                </Grid>
            </Grid>
            <AddLibraryFormDialog
                open={isShowAddLibraryForm}
                loading={isAddLibrarySubmitting}
                onCancel={() => {
                    setIsShowAddLibraryForm(false);
                }}
                onSubmit={handleAddLibraryFormSubmit}
            />
            <LibrarySyncDialog
                open={isShowLibrarySyncDialog}
                loading={isLibrarySyncLoading}
                onCancel={() => {
                    setIsShowLibrarySyncDialog(false);
                }}
                onConfirm={onLibrarySync}
            />
        </Grid>
    );
};

export default Library;
