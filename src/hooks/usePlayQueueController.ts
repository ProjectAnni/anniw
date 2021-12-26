import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { CurrentPlayIndex } from "@/state/queue";
import { PlayQueueItem } from "@/types/common";
import usePlayer from "./usePlayer";
import usePlayQueue from "./usePlayQueue";
import useMessage from "./useMessage";

export default function usePlayQueueController() {
    const [currentPlayIndex, setCurrentPlayIndex] = useRecoilState(CurrentPlayIndex);
    const [player, { play }] = usePlayer();
    const [playQueue, { append, insertToSecond, set, clear, remove }] = usePlayQueue();
    const [_, { addMessage }] = useMessage();

    const playNext = useCallback(() => {
        if (playQueue[currentPlayIndex + 1]) {
            play(playQueue[currentPlayIndex + 1]);
            setCurrentPlayIndex((prev) => prev + 1);
        } else if (currentPlayIndex === playQueue.length - 1) {
            play(playQueue[0]);
            setCurrentPlayIndex(0);
        } else {
            addMessage("info", "播放队列播完啦");
        }
    }, [playQueue, currentPlayIndex, setCurrentPlayIndex, play, addMessage]);

    const playIndex = useCallback(
        (index: number) => {
            if (playQueue[index]) {
                setCurrentPlayIndex(index);
                play(playQueue[index]);
            }
        },
        [playQueue, setCurrentPlayIndex, play]
    );

    const playRandom = useCallback(() => {
        const randomIndex = Math.floor(Math.random() * playQueue.length);
        playIndex(randomIndex);
    }, [playQueue, playIndex]);

    const addToLater = useCallback(
        (item: PlayQueueItem) => {
            insertToSecond(item);
        },
        [insertToSecond]
    );

    const addToPlayQueue = useCallback(
        (item: PlayQueueItem | PlayQueueItem[]) => {
            const addItems = (Array.isArray(item) ? item : [item]).filter(
                (i) =>
                    !playQueue.some(
                        (t) =>
                            t.albumId === i.albumId &&
                            t.discIndex === i.discIndex &&
                            t.trackIndex === i.trackIndex
                    )
            );
            if (addItems.length === 0) {
                addMessage("error", "播放队列中已存在该歌曲");
                return;
            }
            if (playQueue.length === 0) {
                play(addItems[0]);
            }
            append(addItems);
        },
        [addMessage, append, play, playQueue]
    );

    const replacePlayQueue = useCallback(
        (items: PlayQueueItem[]) => {
            set(items);
        },
        [set]
    );

    const replacePlayQueueAndPlay = useCallback(
        (items: PlayQueueItem[], index: number) => {
            play(items[index]);
            set(items);
            setCurrentPlayIndex(index);
        },
        [play, set, setCurrentPlayIndex]
    );

    const clearPlayQueue = useCallback(() => {
        clear();
    }, [clear]);

    const removeFromPlayQueue = useCallback(
        (track: PlayQueueItem) => {
            remove(track);
        },
        [remove]
    );

    return {
        playNext,
        playIndex,
        playRandom,
        addToLater,
        addToPlayQueue,
        replacePlayQueue,
        replacePlayQueueAndPlay,
        clearPlayQueue,
        removeFromPlayQueue,
    };
}
