import React from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { NowPlayingInfoState } from "@/state/player";
import Cover from "@/components/Cover";
import styles from "./index.module.scss";

const PlayerCover: React.FC = () => {
    const nowPlayingInfo = useRecoilValue(NowPlayingInfoState);
    const history = useHistory();
    const { coverUrl } = nowPlayingInfo;
    return (
        <div
            className={styles.coverContainer}
            onClick={() => {
                history.push("/playlist");
            }}
        >
            <Cover coverUrl={coverUrl} />
        </div>
    );
};

export default PlayerCover;
