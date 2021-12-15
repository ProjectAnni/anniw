import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Button, Grid, Typography } from "@material-ui/core";
import useRequest from "@/hooks/useRequest";
import { CredentialState } from "@/state/credentials";
import Loading from "@/components/Loading";
import useMessage from "@/hooks/useMessage";
import { AnnilToken } from "@/types/common";
import {
    getAvailableAnnilTokens,
    deleteAnnilToken,
    createAnnilToken,
    getLibraryAlbums,
} from "./services";
import LibraryList from "./components/LibraryList";
import AddLibraryFormDialog from "./components/AddLibraryForm";
import "./index.scss";

const Library: React.FC = () => {
    const [isShowAddLibraryForm, setIsShowAddLibraryForm] = useState(false);
    const [isAddLibrarySubmitting, setIsAddLibrarySubmitting] = useState(false);
    const [availableTokens, loading] = useRequest(getAvailableAnnilTokens);
    const [credentials, setCredentials] = useRecoilState(CredentialState);
    const [_, { addMessage }] = useMessage();
    const onLibraryDelete = useCallback(async (library: AnnilToken) => {
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
    }, []);
    const onLibraryClick = async (library: AnnilToken) => {
        // const albums = await getLibraryAlbums(library);
        // console.log(albums)
    };
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
            }
        },
        []
    );
    useEffect(() => {
        if (availableTokens?.length) {
            setCredentials({
                credentials: availableTokens,
            });
        }
    }, [availableTokens]);
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
                        onClick={onLibraryClick}
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
        </Grid>
    );
};

export default Library;
