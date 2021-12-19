import { useEffect, useState } from "react";
import usePlayer from "./usePlayer";

type BufferedTimeRanges = { start: number; end: number }[];

export default function usePlayerBufferedRanges() {
    const [player] = usePlayer();
    const [bufferTime, setBufferTime] = useState<BufferedTimeRanges>([]);
    useEffect(() => {
        const onProgress = () => {
            const result = [];
            for (let i = 0; i < player.buffered.length; i++) {
                result.push({
                    start: player.buffered.start(i),
                    end: player.buffered.end(i),
                });
            }
            setBufferTime(result);
        };
        player.addEventListener("progress", onProgress);
        return () => {
            player.removeEventListener("progress", onProgress);
        };
    }, [player]);
    return [bufferTime];
}
