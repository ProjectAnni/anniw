import { NowPlayingInfoState } from "@/state/player";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import usePlayer from "./usePlayer";

export default function usePlayerTime() {
    const [player] = usePlayer();
    const { duration } = useRecoilValue(NowPlayingInfoState);
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
    return [currentTime, duration ?? 0] as const;
}
