import request from "@/api/request";
import { SiteInfo } from "@/types/common";

export function getSiteInfo() {
    return request.get<SiteInfo>("/api/info");
}
