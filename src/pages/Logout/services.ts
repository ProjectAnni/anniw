import request from "@/api/request";
import AlbumDB from "@/db/album";
import LibraryDB from "@/db/library";

export function logout() {
    return request.post("/api/user/logout", undefined);
}

export function deleteLibraryForAllAlbums(url: string) {
    return AlbumDB.deleteLibraryForAllAlbums(url);
}

export function deleteLibraryInfo(url: string) {
    return LibraryDB.delete(url);
}
