import React, { useMemo } from "react";
import usePlayer from "@/hooks/usePlayer";
import usePlayerCurrentTime from "@/hooks/usePlayerCurrentTime";
import styles from "./index.module.scss";

const PlayerProgress: React.FC = () => {
    const [player] = usePlayer();
    const [currentTime] = usePlayerCurrentTime();
    const progressStyle = useMemo(() => {
        return {
            width: `${(currentTime / player.duration) * 100}%`,
        };
    }, [currentTime, player]);
    return (
        <div className={styles.progressContainer}>
            <div className={styles.progress}>
                <div className={styles.filled} style={progressStyle}></div>
            </div>
        </div>
    );
};

export default PlayerProgress;
