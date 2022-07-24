import { AlbumIdentifier, AlbumInfo, DiscIdentifier } from "@/types/common";

export type ExportedPlaylist = ExportedPlaylistInfo & ExportedPlaylistMetadata & ExportedPlaylistToken;

export interface ExportedPlaylistInfo {
    // 播放列表名称
    name: string;
    // 播放列表简介
    description: string;
    // 播放列表封面
    cover: DiscIdentifier;
    // 按顺序存放播放列表中的所有歌曲
    songs: ExportedTrackList[];
}

export interface ExportedPlaylistMetadata {
    // 存放播放列表中的元数据
    // 使用 AlbumInfo，不含 artists 和 tags 信息
    metadata: Record<AlbumIdentifier, AlbumInfo>;
}

export interface ExportedPlaylistToken {
    // 实际访问音频文件的 Token
    tokens: ExportedToken[];
}

export interface ExportedTrackList extends DiscIdentifier {
    tracks: number[];
}

export interface ExportedToken {
    server: string;
    token: string;
}
