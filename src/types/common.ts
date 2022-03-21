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

export interface TrackIdentifier {
    // track_id 与 disc_id 均为从 1 开始
    trackId: number;
    discId: number;
    albumId: string;
}

export interface AlbumDiscIdentifier {
    discId?: number;
    albumId: string;
}

export interface TrackInfo {
    title: string;
    artist: string;
    type: string;
    tags: string[];
}

export interface TrackInfoWithAlbum extends TrackInfo, TrackIdentifier {
    albumTitle: string;
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

export interface PlayQueueItem extends Omit<NormalTrackItem, "itemType"> {
    playUrl?: string;
    coverUrl?: string;
}

export interface PlaylistInfo {
    id: string;
    name: string;
    description?: string;
    owner: string;
    isPublic: boolean;
    cover: AlbumDiscIdentifier;
}

export interface Playlist extends PlaylistInfo {
    songs: PlaylistSong[];
}

export interface BasePlaylistSong {
    id: string;
    description?: string;
}

export interface PlaylistSongDummy extends TrackInfo, BasePlaylistSong {
    type: "dummy";
}

export interface PlaylistSongNormal extends TrackInfoWithAlbum, BasePlaylistSong {
    type: "normal";
}

export type PlaylistSong = PlaylistSongDummy | PlaylistSongNormal;
