import { TrackItem } from "@/components/TrackList/types";

export enum LoginStatus {
    UNKNOWN,
    LOGGED_IN,
    LOGGED_OUT,
}

export enum PlayerStatus {
    PAUSED,
    PLAYING,
    ENDED,
    BUFFERING,
    EMPTY,
}

export interface SiteInfo {
    siteName: string;
    description: string;
    protocolVersion: string;
    features: string[];
}

export interface AnnilToken {
    id: string;
    /** Annil 名称 */
    name: string;
    /** Annil 站点地址 */
    url: string;
    /** Annil Token 内容 */
    token: string;
    /** 客户端尝试访问时的优先级 */
    priority: number;
}

export interface UserInfo {
    userId: string;
    username: string;
    email: string;
    nickname: string;
    avatar: string;
}

export interface TrackIndex {
    // track_id 与 disc_id 均为从 1 开始
    trackId: number;
    discId: number;
    albumId: string;
}

export interface TrackInfo {
    title: string;
    artist: string;
    type: string;
    tags: string[];
}

export interface TrackInfoWithAlbum extends TrackInfo, TrackIndex {}

export interface DiscInfo {
    // meta 仓库中为空时返回所属 Album 的 title
    title: string;
    artist: string;
    catalog: string;
    tags: string[];
    type: string;
    tracks: TrackInfo[];
}

export interface AlbumInfo {
    albumId: string;
    title: string;
    edition?: string;
    catalog: string;
    artist: string;
    date: string;
    tags: string[];
    type: string;
    discs: DiscInfo[];
}

export interface PlayQueueItem extends TrackItem {
    playUrl?: string;
    coverUrl?: string;
}

export interface FavoriteTrackItem extends TrackIndex {
    info?: TrackInfo;
    albumTitle: string;
}
