import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useHistory } from "react-router-dom";
import { CurrentLoginStatus } from "@/state/user";
import { LoginStatus } from "@/types/common";
import Loading from "../Loading";

interface Props {
    children: React.ReactElement<any, any>;
    disableAutoRedirect?: boolean;
}

const NeedLoginPage: React.FC<Props> = (props) => {
    const { children } = props;
    const currentLoginStatus = useRecoilValue(CurrentLoginStatus);
    const history = useHistory();
    useEffect(() => {
        if (currentLoginStatus === LoginStatus.LOGGED_OUT) {
            history.push(`/user/login?return=${history.location.pathname}`);
        }
    }, [currentLoginStatus, history]);
    if (currentLoginStatus === LoginStatus.UNKNOWN) {
        return <Loading />;
    }
    return currentLoginStatus === LoginStatus.LOGGED_IN ? children : null;
};

export default NeedLoginPage;
