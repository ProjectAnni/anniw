import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import useMessage from "@/hooks/useMessage";
import { CurrentLoginStatus, IsLoadedExtendUserInfo } from "@/state/user";
import { CredentialState } from "@/state/credentials";
import { FavoriteAlbumsState, FavoriteTracksState } from "@/state/favorite";
import { PlaylistsState } from "@/state/playlists";
import { LoginStatus } from "@/types/common";
import {
    getAvailableAnnilTokens,
    getFavoriteAlbums,
    getFavoritePlaylists,
    getFavoriteTracks,
} from "../LoginStatus/services";
import Loading from "../Loading";

interface Props {
    children: React.ReactElement<any, any>;
    disableAutoRedirect?: boolean;
}

const NeedLoginPage: React.FC<Props> = (props) => {
    const { children } = props;
    const currentLoginStatus = useRecoilValue(CurrentLoginStatus);
    const setCredential = useSetRecoilState(CredentialState);
    const setFavoriteTracks = useSetRecoilState(FavoriteTracksState);
    const setFavoriteAlbums = useSetRecoilState(FavoriteAlbumsState);
    const setFavoritePlaylists = useSetRecoilState(PlaylistsState);
    const [isLoadedExtendUserInfo, setIsLoadedExtendUserInfo] =
        useRecoilState(IsLoadedExtendUserInfo);
    const navigate = useNavigate();
    const location = useLocation();
    const [, { addMessage }] = useMessage();
    useEffect(() => {
        if (currentLoginStatus === LoginStatus.LOGGED_OUT) {
            navigate(`/user/login?return=${location.pathname}`);
            return;
        }
        if (!isLoadedExtendUserInfo) {
            (async () => {
                try {
                    const [availableTokens, favoriteTracks, favoritePlaylists, favoriteAlbums] = await Promise.all([
                        getAvailableAnnilTokens(),
                        getFavoriteTracks(),
                        getFavoritePlaylists(),
                        getFavoriteAlbums()
                    ]);
                    setCredential({ credentials: availableTokens });
                    setFavoriteTracks(favoriteTracks);
                    setFavoritePlaylists(favoritePlaylists);
                    setFavoriteAlbums(favoriteAlbums);
                    setIsLoadedExtendUserInfo(true);
                } catch (e) {
                    if (e instanceof Error) {
                        addMessage("error", e.message);
                    }
                }
            })();
        }
    }, [
        currentLoginStatus,
        isLoadedExtendUserInfo,
        addMessage,
        setCredential,
        setFavoritePlaylists,
        setFavoriteTracks,
        setFavoriteAlbums,
        setIsLoadedExtendUserInfo,
        navigate,
        location.pathname,
    ]);
    if (currentLoginStatus === LoginStatus.UNKNOWN || !isLoadedExtendUserInfo) {
        return <Loading />;
    }
    return currentLoginStatus === LoginStatus.LOGGED_IN ? children : null;
};

export default NeedLoginPage;
