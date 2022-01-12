import request from "@/api/request";

export function deletePlaylist(id: string) {
    return request.delete("/api/playlist", { id });
}
