import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useMessage from "@/hooks/useMessage";
import { CurrentUserInfo, IsLoadingUserInfo } from "@/state/user";
import { CredentialState } from "@/state/credentials";
import { AnniwBusinessError } from "@/api/request";
import { getAvailableAnnilTokens, getUserInfo } from "./services";

const LoginStatus: React.FC = () => {
    const setIsLoadingUserInfo = useSetRecoilState(IsLoadingUserInfo);
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const setCredential = useSetRecoilState(CredentialState);
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
    return null;
};

export default LoginStatus;
