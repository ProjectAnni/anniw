import { default as AlbumDB } from "@/db/album";

export async function getAlbumAvailableLibraries(albumId: string | null) {
    if (!albumId) {
        return;
    }
    return AlbumDB.getAvailableLibraries(albumId);
}
