import React, { useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import usePlayer from "@/hooks/usePlayer";
import usePlayerCurrentTime from "@/hooks/usePlayerCurrentTime";
import { NowPlayingInfoState } from "@/state/player";
import styles from "./index.module.scss";
import { Link } from "react-router-dom";

const PlayerProgress: React.FC = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [player, { seek }] = usePlayer();
    const [currentTime] = usePlayerCurrentTime();
    const nowPlayerInfo = useRecoilValue(NowPlayingInfoState);
    const { title, artist, album, albumId } = nowPlayerInfo;
    const progressStyle = useMemo(() => {
        return {
            width: `${(currentTime / player.duration) * 100}%`,
        };
    }, [currentTime, player]);
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current) {
            return;
        }
        const { clientX } = e;
        const { left, width } = progressRef.current.getBoundingClientRect();
        const percent = (clientX - left) / width;
        seek(percent * player.duration);
    };

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progress} ref={progressRef} onClick={onClick}>
                <div className={styles.filled} style={progressStyle}></div>
            </div>
            {!!title && !!artist && (
                <div className={styles.topTexts}>
                    {artist.length > 30 ? `${artist.slice(0, 30)}...` : artist} - {title}
                </div>
            )}
            {!!album && (
                <div className={styles.bottomTexts}>
                    <Link to={`/album/detail?id=${albumId}`}>{album}</Link>
                </div>
            )}
        </div>
    );
};

export default PlayerProgress;
