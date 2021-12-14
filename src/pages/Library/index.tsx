import React, { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { Typography } from "@material-ui/core";
import useRequest from "@/hooks/useRequest";
import { CredentialState } from "@/state/credentials";
import Loading from "@/components/Loading";
import useMessage from "@/hooks/useMessage";
import { AnnilToken } from "@/types/common";
import { getAvailableAnnilTokens, deleteAnnilToken } from "./services";
import LibraryList from "./components/LibraryList";
import "./index.scss";

const Library: React.FC = () => {
    const [availableTokens, loading] = useRequest(getAvailableAnnilTokens);
    const [credentials, setCredentials] = useRecoilState(CredentialState);
    const [_, { addMessage }] = useMessage();
    const handleDeleteLibrary = useCallback(async (library: AnnilToken) => {
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
    useEffect(() => {
        if (availableTokens?.length) {
            setCredentials({
                credentials: availableTokens,
            });
        }
    }, [availableTokens]);
    return (
        <div className="library-page-container">
            <Typography variant="h4" className="title">
                音频仓库
            </Typography>
            {loading ? (
                <Loading />
            ) : (
                <div className="library-list-container">
                    <LibraryList
                        libraries={credentials.credentials}
                        handleDelete={handleDeleteLibrary}
                    />
                </div>
            )}
        </div>
    );
};

export default Library;
