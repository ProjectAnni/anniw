import request from "../../api/request";
import { SiteInfo, UserInfo } from "../../types/common";

export function getSiteInfo() {
    return request.get<SiteInfo>("/api/info");
}

export function getUserInfo() {
    return request.get<UserInfo>("/api/user/info");
}