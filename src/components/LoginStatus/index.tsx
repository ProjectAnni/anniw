import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useMessage from "@/hooks/useMessage";
import { CurrentUserInfo, IsLoadingUserInfo } from "@/state/user";
import { CredentialState } from "@/state/credentials";
import { FavoriteTracksState } from "@/state/favorite";
import { PlaylistsState } from "@/state/playlists";
import { AnniwBusinessError } from "@/api/request";
import {
    getAvailableAnnilTokens,
    getFavoriteTracks,
    getUserInfo,
    getFavoritePlaylists,
} from "./services";

const LoginStatus: React.FC = () => {
    const setIsLoadingUserInfo = useSetRecoilState(IsLoadingUserInfo);
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const setCredential = useSetRecoilState(CredentialState);
    const setFavoriteTracks = useSetRecoilState(FavoriteTracksState);
    const setFavoritePlaylists = useSetRecoilState(PlaylistsState);
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        (async () => {
            setIsLoadingUserInfo(true);
            try {
                const [userInfo, availableTokens, favoriteTracks, favoritePlaylists] =
                    await Promise.all([
                        getUserInfo(),
                        getAvailableAnnilTokens(),
                        getFavoriteTracks(),
                        getFavoritePlaylists(),
                    ]);
                setCurrentUserInfo(userInfo);
                setCredential({ credentials: availableTokens });
                setFavoriteTracks(favoriteTracks);
                setFavoritePlaylists(favoritePlaylists);
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
    }, [
        addMessage,
        setCredential,
        setCurrentUserInfo,
        setFavoritePlaylists,
        setFavoriteTracks,
        setIsLoadingUserInfo,
    ]);
    return null;
};

export default LoginStatus;
