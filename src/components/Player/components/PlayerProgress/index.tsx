import React, { useMemo, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import usePlayer from "@/hooks/usePlayer";
import usePlayerTime from "@/hooks/usePlayerTime";
import usePlayerBufferedRanges from "@/hooks/usePlayerBufferedRanges";
import { NowPlayingInfoState, PlayerStatusState } from "@/state/player";
import { PlayerStatus } from "@/types/common";
import styles from "./index.module.scss";

const formatSeconds = (seconds: number) => {
    return seconds < 60
        ? `00:${Math.round(seconds).toString().padStart(2, "0")}`
        : `${Math.floor(seconds / 60)
              .toString()
              .padStart(2, "0")}:${Math.floor(seconds % 60)
              .toString()
              .padStart(2, "0")}`;
};

const PlayerProgress: React.FC = () => {
    const progressRef = useRef<HTMLDivElement>(null);
    const [player, { seek, resume }] = usePlayer();
    const [currentTime, duration] = usePlayerTime();
    const [[bufferedRange]] = usePlayerBufferedRanges();
    const nowPlayerInfo = useRecoilValue(NowPlayingInfoState);
    const playerStatus = useRecoilValue(PlayerStatusState);
    const [isShowTimeTip, setIsShowTimeTip] = useState(false);
    const [timeTipLeft, setTimeTipLeft] = useState(0);
    const { title, artist, albumTitle, albumId } = nowPlayerInfo;
    const playedStyle = useMemo(() => {
        return {
            width: `${(currentTime / duration) * 100}%`,
        };
    }, [currentTime, duration]);
    const bufferedStyle = useMemo(() => {
        const { start, end } = bufferedRange || {};
        if (!start && !end) {
            return {};
        }
        return {
            width: `${((end - start) / duration) * 100}%`,
        };
    }, [bufferedRange, duration]);
    const timeTipTime = useMemo(() => {
        if (!progressRef.current) {
            return;
        }
        const { width } = progressRef.current.getBoundingClientRect();
        const percent = timeTipLeft / width;
        return formatSeconds(percent * duration);
    }, [duration, timeTipLeft]);
    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressRef.current) {
            return;
        }
        if (playerStatus === PlayerStatus.EMPTY) {
            return;
        }
        const { clientX } = e;
        const { left, width } = progressRef.current.getBoundingClientRect();
        const percent = (clientX - left) / width;
        seek(percent * duration);
        resume();
    };
    const [formattedCurrentTime, formattedDuration] = useMemo<[string, string]>(() => {
        if (!currentTime || !duration) {
            return ["--:--", "--:--"];
        }
        return [formatSeconds(currentTime), formatSeconds(duration)];
    }, [currentTime, duration]);

    return (
        <div className={styles.progressContainer}>
            <div
                className={styles.progress}
                ref={progressRef}
                onClick={onClick}
                onMouseEnter={() => {
                    setIsShowTimeTip(true);
                }}
                onMouseLeave={() => {
                    setIsShowTimeTip(false);
                }}
                onMouseMove={(e) => {
                    progressRef.current &&
                        setTimeTipLeft(
                            e.clientX - progressRef.current.getBoundingClientRect().left
                        );
                }}
            >
                <div className={styles.buffered} style={bufferedStyle}></div>
                <div className={styles.played} style={playedStyle}></div>
            </div>
            <div className={styles.time}>
                {formattedCurrentTime} / {formattedDuration}
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
            {isShowTimeTip && !!duration && (
                <div className={styles.timeTip} style={{ left: `${timeTipLeft}px` }}>
                    {timeTipTime}
                </div>
            )}
        </div>
    );
};

export default PlayerProgress;
