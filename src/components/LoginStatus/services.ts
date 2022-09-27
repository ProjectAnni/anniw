import { PlaylistInfo } from "@/types/playlist";
import request from "../../api/request";
import { AnnilToken, TrackInfoWithAlbum, UserInfo } from "../../types/common";

export function getUserInfo() {
    return request.get<UserInfo>("/api/user/info");
}

export function getAvailableAnnilTokens() {
    return request.get<AnnilToken[]>("/api/credential");
}

export function getFavoriteTracks() {
    return request.get<TrackInfoWithAlbum[]>("/api/favorite/music");
}
export function getFavoritePlaylists() {
    return request.get<PlaylistInfo[]>("/api/playlists");
}
export async function getFavoriteAlbums() {
    return await request.get<string[]>("/api/favorite/album");
}

export async function addFavoriteAlbum(albumId: string) {
    return await request.put("/api/favorite/album", { albumId });
}
export async function deleteFavoriteAlbum(albumId: string) {
    return await request.delete("/api/favorite/album", { albumId });
}

export function getLibraryAlbums(library: AnnilToken) {
    return request.get<string[]>(
        `${library.url}/albums`,
        {
            auth: library.token,
        },
        {
            unwrapResponse: false,
        }
    );
}

export interface LibraryInfoResponse {
    /** 服务端版本描述 */
    version: string;
    /** 服务端运行的 Annil 音频仓库协议版本 */
    protocolVersion: string;
    /** 服务端最近一次数据更新时间 */
    lastUpdate: number;
}

export function getLibraryInfo(library: AnnilToken) {
    return request.get<LibraryInfoResponse>(
        `${library.url}/info`,
        {},
        {
            unwrapResponse: false,
        }
    );
}
