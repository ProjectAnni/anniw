import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useMessage from "@/hooks/useMessage";
import { CurrentUserInfo, IsLoadingUserInfo } from "@/state/user";
import { CredentialState } from "@/state/credentials";
import { FavoriteTracksState } from "@/state/favorite";
import { AnniwBusinessError } from "@/api/request";
import { getAvailableAnnilTokens, getFavoriteTracks, getUserInfo } from "./services";

const LoginStatus: React.FC = () => {
    const setIsLoadingUserInfo = useSetRecoilState(IsLoadingUserInfo);
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const setCredential = useSetRecoilState(CredentialState);
    const setFavoriteTracks = useSetRecoilState(FavoriteTracksState);
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        (async () => {
            setIsLoadingUserInfo(true);
            try {
                const [userInfo, availableTokens, favoriteTracks] = await Promise.all([
                    getUserInfo(),
                    getAvailableAnnilTokens(),
                    getFavoriteTracks(),
                ]);
                setCurrentUserInfo(userInfo);
                setCredential({ credentials: availableTokens });
                setFavoriteTracks(favoriteTracks);
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
    }, [addMessage, setCredential, setCurrentUserInfo, setFavoriteTracks, setIsLoadingUserInfo]);
    return null;
};

export default LoginStatus;
