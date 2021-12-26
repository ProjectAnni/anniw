import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { PlayQueueState } from "@/state/queue";
import { PlayQueueItem } from "@/types/common";

export default function usePlayQueue() {
    const [playQueue, setPlayQueue] = useRecoilState(PlayQueueState);

    const append = useCallback(
        ([...tracks]: PlayQueueItem[]) => {
            setPlayQueue((queue) => [...queue, ...tracks]);
        },
        [setPlayQueue]
    );

    const unshift = useCallback(
        (track: PlayQueueItem) => {
            setPlayQueue((queue) => [track, ...queue]);
        },
        [setPlayQueue]
    );

    const replaceFirst = useCallback(
        (item: PlayQueueItem) => {
            setPlayQueue((queue) => [item, ...queue.slice(1)]);
        },
        [setPlayQueue]
    );

    const insertToSecond = useCallback(
        (track: PlayQueueItem) => {
            setPlayQueue((queue) => [...queue.slice(0, 1), track, ...queue.slice(1)]);
        },
        [setPlayQueue]
    );

    const shift = useCallback(() => {
        setPlayQueue((queue) => queue.slice(1));
    }, [setPlayQueue]);

    const clear = useCallback(() => {
        setPlayQueue([]);
    }, [setPlayQueue]);

    const set = useCallback(
        (tracks: PlayQueueItem[]) => {
            setPlayQueue(tracks);
        },
        [setPlayQueue]
    );

    const remove = useCallback(
        (track: PlayQueueItem) => {
            const index = playQueue.findIndex(
                (t) =>
                    t.albumId === track.albumId &&
                    t.discIndex === track.discIndex &&
                    t.trackIndex === track.trackIndex
            );
            if (index !== -1) {
                setPlayQueue((queue) => [...queue.slice(0, index), ...queue.slice(index + 1)]);
            }
        },
        [playQueue, setPlayQueue]
    );

    return [
        playQueue,
        { append, unshift, replaceFirst, insertToSecond, shift, clear, set, remove },
    ] as const;
}
