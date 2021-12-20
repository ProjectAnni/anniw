import React, { useMemo, useRef } from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import usePlayer from "@/hooks/usePlayer";
import usePlayerCurrentTime from "@/hooks/usePlayerCurrentTime";
import usePlayerBufferedRanges from "@/hooks/usePlayerBufferedRanges";
import { NowPlayingInfoState } from "@/state/player";
import styles from "./index.module.scss";

const PlayerProgress: React.FC = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [player, { seek, resume }] = usePlayer();
    const [currentTime] = usePlayerCurrentTime();
    const [[bufferedRange]] = usePlayerBufferedRanges();
    const nowPlayerInfo = useRecoilValue(NowPlayingInfoState);
    const { title, artist, albumTitle, albumId } = nowPlayerInfo;
    const playedStyle = useMemo(() => {
        return {
            width: `${(currentTime / player.duration) * 100}%`,
        };
    }, [currentTime, player]);
    const bufferedStyle = useMemo(() => {
        const { start, end } = bufferedRange || {};
        if (!start && !end) {
            return {};
        }
        return {
            width: `${((end - start) / player.duration) * 100}%`,
        };
    }, [bufferedRange, player]);
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current) {
            return;
        }
        const { clientX } = e;
        const { left, width } = progressRef.current.getBoundingClientRect();
        const percent = (clientX - left) / width;
        seek(percent * player.duration);
        resume();
    };

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progress} ref={progressRef} onClick={onClick}>
                <div className={styles.buffered} style={bufferedStyle}></div>
                <div className={styles.played} style={playedStyle}></div>
            </div>
            {!!title && !!artist && (
                <div className={styles.topTexts}>
                    {artist.length > 30 ? `${artist.slice(0, 30)}...` : artist} - {title}
                </div>
            )}
            {!!albumTitle && (
                <div className={styles.bottomTexts}>
                    <Link to={`/album/${albumId}`}>{albumTitle}</Link>
                </div>
            )}
        </div>
    );
};

export default PlayerProgress;
