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
