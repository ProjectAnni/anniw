import request from "@/api/request";
import { AnnilToken } from "@/types/common";

export function getAvailableAnnilTokens() {
    return request.get<AnnilToken[]>("/api/credential");
}

export function deleteAnnilToken(id: string) {
    return request.delete(`/api/credential/`, {
        id,
    });
}
