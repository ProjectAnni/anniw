export enum LoopMode {
    TRACK_LOOP,
    LIST_LOOP,
    SHUFFLE,
}

export const LoopModeNextMap: Record<LoopMode, LoopMode> = {
    [LoopMode.TRACK_LOOP]: LoopMode.LIST_LOOP,
    [LoopMode.LIST_LOOP]: LoopMode.SHUFFLE,
    [LoopMode.SHUFFLE]: LoopMode.TRACK_LOOP,
};
