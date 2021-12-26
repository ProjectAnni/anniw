import { default as LibraryDB } from "@/db/library";

export async function getLibraryAlbums(url: string) {
    const libraryInfo = await LibraryDB.get(url);
    const { albums = [] } = libraryInfo || {};
    return albums;
}
