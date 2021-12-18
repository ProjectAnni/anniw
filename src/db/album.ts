import { openDB, deleteDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";
import { AlbumInfo } from "@/types/common";

const DB_VERSION = 2;
const DB_NAME = "anniw_album";

enum AlbumStoreNames {
    AlbumLibraryMap = "album_library_map",
    AlbumInfo = "album_info",
}

interface AlbumLibraryMapItem {
    albumId: string;
    availableLibraries: string[];
}

interface AlbumDB extends DBSchema {
    [AlbumStoreNames.AlbumLibraryMap]: {
        key: string;
        value: AlbumLibraryMapItem;
    };
    [AlbumStoreNames.AlbumInfo]: {
        key: string;
        value: AlbumInfo;
    };
}

class Album {
    db: Promise<IDBPDatabase<AlbumDB>>;

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

    async set(storeName: AlbumStoreNames, payload: AlbumLibraryMapItem | AlbumInfo) {
        return (await this.db).put(storeName, payload);
    }

    async getAvailableLibraries(albumId: string) {
        const mapItem = (await this.get(
            AlbumStoreNames.AlbumLibraryMap,
            albumId
        )) as AlbumLibraryMapItem;
        return mapItem?.availableLibraries || [];
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

    async getAlbumInfo(albumId: string) {
        return (await this.get(AlbumStoreNames.AlbumInfo, albumId)) as AlbumInfo | undefined;
    }

    async addAlbumInfo(albumInfo: AlbumInfo) {
        return this.set(AlbumStoreNames.AlbumInfo, albumInfo);
    }

    async dropAllStores() {
        return await deleteDB(DB_NAME);
    }
}

export default new Album();
