import { NormalTrackItem } from "@/components/TrackList/types";

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

// 专辑标识符
export type AlbumIdentifier = string; // UUID

// 光盘标识符
export interface DiscIdentifier {
    // 专辑 ID
    albumId: AlbumIdentifier;
    // 光盘 ID，从 1 开始
    discId: number;
}

// 音轨标识符
export type TrackIdentifier = DiscIdentifier & {
    // 音轨 ID，从 1 开始
    trackId: number;
};

// 专辑信息
export interface AlbumInfo {
    // 专辑 ID
    albumId: AlbumIdentifier;
    // 专辑名称
    title: string;
    // 专辑类型
    edition?: string;
    // 专辑品番
    catalog: string;
    // 专辑艺术家
    artist: string;
    // 专辑的发行日期
    date: string;
    // 音乐类型
    type: TrackType;
    // 光盘信息
    discs: DiscInfo[];
}
// 专辑详细信息
export type AlbumDetail = AlbumInfo & {
    // 专辑详细艺术家
    artists?: Artists;
    // 专辑标签
    tags?: string[];
    // 光盘信息
    discs: DiscDetail[];
};
// 光盘信息
export interface DiscInfo {
    // 光盘名称
    title?: string;
    // 光盘品番
    catalog: string;
    // 光盘艺术家
    artist?: string;
    // 音乐类型
    type?: TrackType;
    // 音轨信息
    tracks: TrackInfo[];
}
// 光盘详细信息
export type DiscDetail = DiscInfo & {
    // 光盘详细艺术家
    artists?: Artists;
    // 光盘标签
    tags?: string[];
    // 音轨信息
    tracks: TrackDetail[];
};
// 音轨信息
export interface TrackInfo {
    // 音轨标题
    title: string;
    // 音轨艺术家
    artist?: string;
    // 音乐类型
    type?: TrackType;
}
// 音轨详细信息
export type TrackDetail = TrackInfo & {
    // 音轨详细艺术家
    artists?: Artists;
    // 音轨标签
    tags?: string[];
};
// 详细艺术家
export type Artists = ExtendedArtists & Record<string, string>;
// 详细艺术家的预定义字段
export interface ExtendedArtists {
    // 歌手
    vocal?: string;
    // 作曲
    composer?: string;
    // 作词
    lyricist?: string;
    // 编曲
    arranger?: string;
}
// 音乐类型
export type TrackType = "normal" | "instrumental" | "absolute" | "drama" | "radio" | "vocal";

// 标签简介
export interface TagInfo {
    // Tag 名称
    name: string;
    // Tag 类型
    type: TagType;
}
// 标签详细信息
export type TagDetail = TagInfo & {
    // Tag 别名
    alias?: string[];
    // 父级 Tag
    includedBy?: string[];
    // 子 Tag
    includes?: Record<TagType, string[]>;
};
// 标签类型
export type TagType =
    | "artist"
    | "group"
    | "animation"
    | "series"
    | "project"
    | "game"
    | "organization"
    | "category"
    | "default";

export type AlbumTitle = { albumTitle: string };

export type TrackInfoWithAlbum = TrackIdentifier & Required<TrackInfo> & AlbumTitle;

export interface PlayQueueItem extends Omit<NormalTrackItem, "itemType"> {
    playUrl?: string;
    coverUrl?: string;
}

interface PlaylistInfo {
    // 播放列表 ID
    id: string;
    // 播放列表标题
    name: string;
    // 播放列表说明
    description?: string;
    // 播放列表创建者
    owner: string;
    // 是否公开
    isPublic: boolean;
    // 封面
    cover: DiscIdentifier;
}

export interface Id {
    id: string;
}

export interface Playlist extends PlaylistInfo {
    items: (PlaylistItem & Id)[];
}

export interface BasePlaylistItem<Info> {
    // 内容类型
    type: string;
    // 内容说明
    description?: string;
    // 内容附加信息
    info: Info;
}

// 普通音轨
export interface PlaylistItemTrack extends BasePlaylistItem<TrackInfoWithAlbum>, TrackIdentifier {
    type: "normal";
}

// 占位音轨
export interface PlaylistItemDummyTrack extends BasePlaylistItem<Required<TrackInfo>> {
    type: "dummy";
}

// 普通专辑
export interface PlaylistItemAlbum extends BasePlaylistItem<AlbumIdentifier> {
    type: "album";
}

export type PlaylistItem = PlaylistItemDummyTrack | PlaylistItemTrack | PlaylistItemAlbum;

export function isPlaylistItemTrack(item: PlaylistItem): item is PlaylistItemTrack;
export function isPlaylistItemTrack(item: PlaylistItem & Id): item is PlaylistItemTrack & Id;
export function isPlaylistItemTrack(item: PlaylistItem): boolean {
    return item.type === "normal";
}

export function isPlaylistItemDummyTrack(item: PlaylistItem): item is PlaylistItemDummyTrack;
export function isPlaylistItemDummyTrack(
    item: PlaylistItem & Id
): item is PlaylistItemDummyTrack & Id;
export function isPlaylistItemDummyTrack(item: PlaylistItem): boolean {
    return item.type === "dummy";
}

export function isPlaylistItemAlbum(item: PlaylistItem): item is PlaylistItemAlbum;
export function isPlaylistItemAlbum(item: PlaylistItem & Id): item is PlaylistItemAlbum & Id;
export function isPlaylistItemAlbum(item: PlaylistItem): boolean {
    return item.type === "album";
}
