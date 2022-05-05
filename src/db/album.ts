import { openDB, deleteDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import dayjs from "dayjs";
import { AlbumDetail, InheritedAlbumDetail } from "@/types/common";

const DB_VERSION = 2;
const DB_NAME = "anniw_album";

enum AlbumStoreNames {
    AlbumLibraryMap = "album_library_map",
    AlbumInfo = "album_info",
}

interface AlbumLibraryMapItem {
    albumId: string;
    availableLibraries: string[];
    createdAt?: string;
}

interface AlbumDB extends DBSchema {
    [AlbumStoreNames.AlbumLibraryMap]: {
        key: string;
        value: AlbumLibraryMapItem;
    };
    [AlbumStoreNames.AlbumInfo]: {
        key: string;
        value: AlbumDetail;
    };
}

class Album {
    db: Promise<IDBPDatabase<AlbumDB>>;
    albumLibraryMapCache = new Map<string, string[]>();

    constructor() {
        this.db = openDB<AlbumDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (!oldVersion) {
                    db.createObjectStore(AlbumStoreNames.AlbumLibraryMap, {
                        keyPath: "albumId",
                    });
                }
                if (oldVersion < 2) {
                    db.createObjectStore(AlbumStoreNames.AlbumInfo, {
                        keyPath: "albumId",
                    });
                }
            },
        });
    }

    async get(storeName: AlbumStoreNames, albumId: string) {
        return (await this.db).get(storeName, albumId);
    }

    async set(storeName: AlbumStoreNames, payload: AlbumLibraryMapItem | AlbumDetail) {
        return (await this.db).put(storeName, payload);
    }

    async getAvailableLibraries(albumId: string) {
        if (this.albumLibraryMapCache.has(albumId)) {
            return this.albumLibraryMapCache.get(albumId) || [];
        }
        const mapItem = (await this.get(
            AlbumStoreNames.AlbumLibraryMap,
            albumId
        )) as AlbumLibraryMapItem;
        const result = mapItem?.availableLibraries || [];
        this.albumLibraryMapCache.set(albumId, result);
        return result;
    }

    async addAvailableLibrary(albumId: string, libraryUrl: string) {
        const mapItem = (await this.get(
            AlbumStoreNames.AlbumLibraryMap,
            albumId
        )) as AlbumLibraryMapItem;
        const currentAvailableLibraryUrls = mapItem?.availableLibraries || [];
        if (!currentAvailableLibraryUrls.includes(libraryUrl)) {
            const newAvailableLibraryUrls = [...currentAvailableLibraryUrls, libraryUrl];
            return this.set(AlbumStoreNames.AlbumLibraryMap, {
                albumId,
                availableLibraries: newAvailableLibraryUrls,
                ...(currentAvailableLibraryUrls.length === 0
                    ? { createdAt: dayjs().format("YYYY-MM-DD") }
                    : {}),
            });
        }
    }

    async deleteAvailableLibrary(albumId: string, libraryUrl: string) {
        const mapItem = (await this.get(
            AlbumStoreNames.AlbumLibraryMap,
            albumId
        )) as AlbumLibraryMapItem;
        const currentAvailableLibraryUrls = mapItem?.availableLibraries || [];
        const newAvailableLibraryUrls = currentAvailableLibraryUrls.filter(
            (url) => url !== libraryUrl
        );
        return this.set(AlbumStoreNames.AlbumLibraryMap, {
            albumId,
            availableLibraries: newAvailableLibraryUrls,
        });
    }

    async deleteLibraryForAllAlbums(libraryUrl: string) {
        const albumIds = await (await this.db).getAllKeys(AlbumStoreNames.AlbumLibraryMap);
        for (const albumId of albumIds) {
            await this.deleteAvailableLibrary(albumId, libraryUrl);
        }
    }

    async getAlbumInfo(albumId: string): Promise<InheritedAlbumDetail | undefined> {
        const albumInfo = (await this.get(AlbumStoreNames.AlbumInfo, albumId)) as
            | AlbumDetail
            | undefined;
        if (albumInfo) {
            for (const disc of albumInfo.discs) {
                if (!disc.title) {
                    disc.title = albumInfo.title;
                }
                for (const track of disc.tracks) {
                    if (!track.type) {
                        track.type = disc.type ?? albumInfo.type;
                    }
                    if (!track.artist) {
                        track.artist = disc.artist ?? albumInfo.artist;
                    }
                    if (!track.artists) {
                        track.artists = disc.artists ?? albumInfo.artists;
                    }
                }
            }
        }
        return albumInfo as InheritedAlbumDetail | undefined;
    }

    async addAlbumInfo(albumInfo: AlbumDetail) {
        return this.set(AlbumStoreNames.AlbumInfo, albumInfo);
    }

    async deleteAlbumInfo(albumId: string) {
        return (await this.db).delete(AlbumStoreNames.AlbumInfo, albumId);
    }

    async dropAllStores() {
        return await deleteDB(DB_NAME);
    }

    async clearCache() {
        this.albumLibraryMapCache.clear();
    }
}

export default new Album();
