import request from "../../api/request";
import { AnnilToken, TrackInfoWithAlbum, UserInfo, PlaylistInfo } from "../../types/common";

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
