import { useEffect, useState } from "react";
import usePlayer from "./usePlayer";
import { useRecoilValue } from "recoil";
import { PlayerDurationState } from "@/state/player";

export default function usePlayerTime() {
    const [currentTime, setCurrentTime] = useState(0);
    const duration = useRecoilValue(PlayerDurationState);
    const [player] = usePlayer();
    useEffect(() => {
        const onTimeUpdate = () => {
            setCurrentTime(player.currentTime);
        };
        player.addEventListener("timeupdate", onTimeUpdate);
        return () => {
            player.removeEventListener("timeupdate", onTimeUpdate);
        };
    }, [player, duration]);
    return [currentTime, duration] as const;
}
