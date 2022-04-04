import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useHistory } from "react-router-dom";
import useMessage from "@/hooks/useMessage";
import { CurrentLoginStatus, IsLoadedExtendUserInfo } from "@/state/user";
import { CredentialState } from "@/state/credentials";
import { FavoriteTracksState } from "@/state/favorite";
import { PlaylistsState } from "@/state/playlists";
import { LoginStatus } from "@/types/common";
import {
    getAvailableAnnilTokens,
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
    const setFavoritePlaylists = useSetRecoilState(PlaylistsState);
    const [isLoadedExtendUserInfo, setIsLoadedExtendUserInfo] =
        useRecoilState(IsLoadedExtendUserInfo);
    const history = useHistory();
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        if (currentLoginStatus === LoginStatus.LOGGED_OUT) {
            history.push(`/user/login?return=${history.location.pathname}`);
            return;
        }
        if (!isLoadedExtendUserInfo) {
            (async () => {
                try {
                    const [availableTokens, favoriteTracks, favoritePlaylists] = await Promise.all([
                        getAvailableAnnilTokens(),
                        getFavoriteTracks(),
                        getFavoritePlaylists(),
                    ]);
                    setCredential({ credentials: availableTokens });
                    setFavoriteTracks(favoriteTracks);
                    setFavoritePlaylists(favoritePlaylists);
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
        history,
        isLoadedExtendUserInfo,
        addMessage,
        setCredential,
        setFavoritePlaylists,
        setFavoriteTracks,
        setIsLoadedExtendUserInfo,
    ]);
    if (currentLoginStatus === LoginStatus.UNKNOWN || !isLoadedExtendUserInfo) {
        return <Loading />;
    }
    return currentLoginStatus === LoginStatus.LOGGED_IN ? children : null;
};

export default NeedLoginPage;
