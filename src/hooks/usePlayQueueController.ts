import { useCallback, useRef } from "react";
import { useRecoilState } from "recoil";
import { CurrentPlayIndex } from "@/state/queue";
import { PlayQueueItem } from "@/types/common";
import usePlayer from "./usePlayer";
import usePlayQueue from "./usePlayQueue";
import useMessage from "./useMessage";

export default function usePlayQueueController() {
    const [currentPlayIndex, setCurrentPlayIndex] = useRecoilState(CurrentPlayIndex);
    const [player, { play, preload }] = usePlayer();
    const [playQueue, { append, insertToSecond, set, clear, remove }] = usePlayQueue();
    const [_, { addMessage }] = useMessage();
    const isPreloading = useRef(false);

    const onCurrentPlayIndexChange = useCallback(
        async (newCurrentPlayIndex: number) => {
            if (playQueue[newCurrentPlayIndex + 1] && !isPreloading.current) {
                isPreloading.current = true;
                await preload(playQueue[newCurrentPlayIndex + 1]);
                isPreloading.current = false;
            }
        },
        [playQueue, preload]
    );

    const playNext = useCallback(() => {
        if (playQueue[currentPlayIndex + 1]) {
            play(playQueue[currentPlayIndex + 1]);
            setCurrentPlayIndex((prev) => {
                onCurrentPlayIndexChange(prev + 1);
                return prev + 1;
            });
        } else if (currentPlayIndex === playQueue.length - 1) {
            play(playQueue[0]);
            setCurrentPlayIndex(0);
            onCurrentPlayIndexChange(0);
        } else {
            addMessage("info", "播放队列播完啦");
        }
    }, [
        playQueue,
        currentPlayIndex,
        play,
        setCurrentPlayIndex,
        onCurrentPlayIndexChange,
        addMessage,
    ]);

    const playIndex = useCallback(
        (index: number) => {
            if (playQueue[index]) {
                setCurrentPlayIndex(index);
                onCurrentPlayIndexChange(index);
                play(playQueue[index]);
            }
        },
        [playQueue, setCurrentPlayIndex, onCurrentPlayIndexChange, play]
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
                            t.discId === i.discId &&
                            t.trackId === i.trackId
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
        async (items: PlayQueueItem[], index: number) => {
            await play(items[index]);
            set(items);
            setCurrentPlayIndex(index);
            onCurrentPlayIndexChange(index);
        },
        [onCurrentPlayIndexChange, play, set, setCurrentPlayIndex]
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
