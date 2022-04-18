import { NormalTrackItem } from "@/components/TrackList/types";
import {
    AlbumIdentifier,
    DiscIdentifier,
    TrackIdentifier,
    TrackInfo,
    TrackInfoWithAlbum,
} from "./common";

export interface PlaylistInfo {
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
export interface PlaylistItemTrack extends BasePlaylistItem<TrackInfoWithAlbum> {
    type: "normal";
}

// 普通音轨（无元数据）
export interface PlaylistItemPlainTrack extends BasePlaylistItem<TrackIdentifier> {
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
export type PlaylistPatchItem = PlaylistItemDummyTrack | PlaylistItemPlainTrack | PlaylistItemAlbum;

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

export type PatchPlaylistRequestBody =
    | PatchPlaylistInfoBody
    | AppendPlaylistBody
    | RemovePlaylistItemBody
    | ReorderPlaylistBody
    | ReplacePlaylistItemBody;

// 修改 Playlist 本身信息
export type PatchPlaylistInfoBody = PatchPlaylistBodyType<"info", PatchedPlaylistInfo>;
// 在 Playlist 末尾增加音乐
export type AppendPlaylistBody = PatchPlaylistBodyType<"append", PlaylistPatchItem[]>;
// 通过 ID 从 Playlist 中删除音乐
export type RemovePlaylistItemBody = PatchPlaylistBodyType<"remove", string[]>;
// 通过 ID 对 Playlist 重排序
export type ReorderPlaylistBody = PatchPlaylistBodyType<"reorder", string[]>;
// 修改 Playlist 中部分内容
export type ReplacePlaylistItemBody = PatchPlaylistBodyType<"replace", (PlaylistPatchItem & Id)[]>;

type PatchPlaylistBodyType<K, P> = Id & {
    command: K;
    payload: P;
};

export interface PatchedPlaylistInfo {
    name?: string;
    description?: string;
    is_public?: boolean;
    cover?: DiscIdentifier;
}
