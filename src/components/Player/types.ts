export enum LoopMode {
    TRACK_LOOP,
    LIST_LOOP,
}

export const LoopModeNextMap: Record<LoopMode, LoopMode> = {
    [LoopMode.TRACK_LOOP]: LoopMode.LIST_LOOP,
    [LoopMode.LIST_LOOP]: LoopMode.TRACK_LOOP,
};
