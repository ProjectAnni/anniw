export enum LoginStatus {
    UNKNOWN,
    LOGGED_IN,
    LOGGED_OUT,
}

export interface Indexable {
    id: string;
}

export interface MusicIndex {
    albumId: string;
    track: number;
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

export interface TrackInfo {
    title: string;
    artist: string;
    type: string;
    tags: string[];
}

export interface TrackInfoWithAlbum extends TrackInfo {
    // track_id 与 disc_id 均为从 1 开始
    trackId: number;
    discId: number;
    albumId: string;
}

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
