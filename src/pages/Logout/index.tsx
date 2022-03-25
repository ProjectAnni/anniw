import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Alert, AlertTitle } from "@mui/material";
import useMessage from "@/hooks/useMessage";
import { sleep } from "@/utils/helper";
import { CurrentUserInfo } from "@/state/user";
import { CredentialState } from "@/state/credentials";
import storage from "@/utils/storage";
import { deleteLibraryForAllAlbums, deleteLibraryInfo, logout } from "./services";
import "./index.scss";

const Logout: React.FC = () => {
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const history = useHistory();
    const { credentials: allAvailableCredentials } = useRecoilValue(CredentialState);
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        logout()
            .then(async () => {
                addMessage("success", "登出成功");
                await sleep(2000);
                storage.delete("userInfo");
                storage.delete("playlist");
                if (allAvailableCredentials.length) {
                    for (const library of allAvailableCredentials) {
                        await deleteLibraryForAllAlbums(library.url);
                        await deleteLibraryInfo(library.url);
                    }
                }
                setCurrentUserInfo(null);
                history.push("/");
                location.reload();
            })
            .catch((e) => {
                addMessage("error", e.message);
            });
    }, [addMessage, allAvailableCredentials, history, setCurrentUserInfo]);
    return (
        <div className="logout-container">
            <Alert severity="info" sx={{ width: "50%" }}>
                <AlertTitle>正在登出！</AlertTitle>
                登出成功后会为您重定向到首页
            </Alert>
        </div>
    );
};

export default Logout;
