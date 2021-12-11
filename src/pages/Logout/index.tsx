import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { Alert, AlertTitle } from "@material-ui/core";
import useMessage from "@/hooks/useMessage";
import { sleep } from "@/utils/helper";
import { CurrentUserInfo } from "@/state/user";
import storage from "@/utils/storage";
import { logout } from "./services";
import "./index.scss";

const Logout: React.FC = () => {
    const setCurrentUserInfo = useSetRecoilState(CurrentUserInfo);
    const history = useHistory();
    const [_, { addMessage }] = useMessage();
    useEffect(() => {
        logout()
            .then(async () => {
                addMessage("success", "登出成功");
                await sleep(2000);
                storage.delete("userInfo");
                setCurrentUserInfo(null);
                history.push("/");
            })
            .catch((e) => {
                addMessage("error", e.message);
            });
    }, []);
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
