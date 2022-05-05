import React, { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import useMessage from "@/hooks/useMessage";
import { CurrentUserInfo, IsLoadingUserInfo } from "@/state/user";
import { CredentialState } from "@/state/credentials";
import { AnniwBusinessError } from "@/api/request";
import AlbumDB from "@/db/album";
import LibraryDB from "@/db/library";
import { getAvailableAnnilTokens, getLibraryAlbums, getLibraryInfo, getUserInfo } from "./services";

const LoginStatus: React.FC = () => {
    const setIsLoadingUserInfo = useSetRecoilState(IsLoadingUserInfo);
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const [credentials, setCredential] = useRecoilState(CredentialState);
    const hasSyncedLibraries = useRef<string[]>([]);
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        (async () => {
            setIsLoadingUserInfo(true);
            try {
                const [userInfo, availableTokens] = await Promise.all([
                    getUserInfo(),
                    getAvailableAnnilTokens(),
                ]);
                setCurrentUserInfo(userInfo);
                setCredential({ credentials: availableTokens });
            } catch (e) {
                if (e instanceof AnniwBusinessError && e.code === 902002) {
                    // 未登录 忽略
                } else if (e instanceof Error) {
                    addMessage("error", e.message);
                }
            } finally {
                setIsLoadingUserInfo(false);
            }
        })();
    }, [addMessage, setCredential, setCurrentUserInfo, setIsLoadingUserInfo]);
    useEffect(() => {
        (async () => {
            if (credentials.credentials?.length) {
                const prevSyncedLibrariesCount = hasSyncedLibraries.current.length;
                for (const credential of credentials.credentials) {
                    if (!hasSyncedLibraries.current.includes(credential.url)) {
                        hasSyncedLibraries.current.push(credential.url);
                        try {
                            const libraryInfo = await getLibraryInfo(credential);
                            const { lastUpdate } = libraryInfo;
                            const albums = await getLibraryAlbums(credential);
                            if (albums?.length > 0) {
                                for (const albumId of albums) {
                                    await AlbumDB.addAvailableLibrary(albumId, credential.url);
                                }
                            }
                            AlbumDB.clearCache();
                            await LibraryDB.set({
                                url: credential.url,
                                serverLastUpdate: new Date(lastUpdate * 1000),
                                lastSync: new Date(),
                                albums: albums?.length ? albums : [],
                                albumCount: +albums?.length,
                            });
                            addMessage("success", "音频仓库同步成功");
                        } catch (e) {
                            console.error("同步音频仓库失败", e);
                            if (e instanceof Error) {
                                addMessage("error", `同步音频仓库失败: ${e.message}`);
                            }
                        }
                    }
                }
                if (prevSyncedLibrariesCount !== hasSyncedLibraries.current.length) {
                    setCredential({ credentials: [...credentials.credentials] });
                }
            }
        })();
    }, [addMessage, credentials, setCredential]);
    return null;
};

export default LoginStatus;
