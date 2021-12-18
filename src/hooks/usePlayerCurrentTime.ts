import { useEffect, useState } from "react";
import usePlayer from "./usePlayer";

export default function usePlayerCurrentTime() {
    const [player] = usePlayer();
    const [currentTime, setCurrentTime] = useState(0);
    useEffect(() => {
        const onTimeUpdate = () => {
            setCurrentTime(player.currentTime);
        };
        player.addEventListener("timeupdate", onTimeUpdate);
        return () => {
            player.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, [player]);
    return [currentTime];
}
