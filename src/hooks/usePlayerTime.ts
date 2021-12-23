import { useEffect, useState } from "react";
import usePlayer from "./usePlayer";

export default function usePlayerTime() {
    const [player] = usePlayer();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        const onTimeUpdate = () => {
            setCurrentTime(player.currentTime);
        };
        const onDurationChange = () => {
            setDuration(player.duration);
        };
        player.addEventListener("timeupdate", onTimeUpdate);
        player.addEventListener("durationchange", onDurationChange);
        return () => {
            player.removeEventListener("timeupdate", onTimeUpdate);
            player.removeEventListener("durationchange", onDurationChange);
        };
    }, [player]);
    return [currentTime, duration] as const;
}
