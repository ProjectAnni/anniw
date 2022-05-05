import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { NowPlayingInfoState } from "@/state/player";
import Cover from "@/components/Cover";
import styles from "./index.module.scss";

const PlayerCover: React.FC = () => {
    const nowPlayingInfo = useRecoilValue(NowPlayingInfoState);
    const navigate = useNavigate();
    const { coverUrl } = nowPlayingInfo;
    return (
        <div
            className={styles.coverContainer}
            onClick={() => {
                navigate("/now");
            }}
        >
            <Cover coverUrl={coverUrl} />
        </div>
    );
};

export default PlayerCover;
