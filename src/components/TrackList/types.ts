export interface TrackItem {
    title: string;
    type: string;
    artist: string;
    discIndex: number;
    trackIndex: number;
    albumId: string;
    albumTitle: string;
    tags: string[];
}

export enum TrackListFeatures {
    /** 显示添加到播放队列按钮 */
    SHOW_PLAY_QUEUE_ADD_ICON,
    /** 显示删除按钮 */
    SHOW_PLAY_QUEUE_REMOVE_ICON,
    /** 显示加入喜欢按钮 */
    SHOW_FAVORITE_ICON,
    /** 显示 Track 序号 */
    SHOW_TRACK_NO,
    /** 显示 添加到下一首 */
    SHOW_ADD_TO_LATER,
    /** 显示 添加到播放列表 */
    SHOW_ADD_TO_PLAYLIST,
}

export const AdvancedFeatures = [
    TrackListFeatures.SHOW_ADD_TO_LATER,
    TrackListFeatures.SHOW_ADD_TO_PLAYLIST,
];
