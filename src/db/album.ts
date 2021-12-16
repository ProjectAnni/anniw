import { openDB, deleteDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

const DB_VERSION = 1;
const DB_NAME = "anniw_album";

enum AlbumStoreNames {
    AlbumLibraryMap = "album_library_map",
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
}

class Album {
    db: Promise<IDBPDatabase<AlbumDB>>;

    constructor() {
        this.db = openDB<AlbumDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                // if (oldVersion) {
                //     db.deleteObjectStore(TABLE_NAME);
                // }
                db.createObjectStore(AlbumStoreNames.AlbumLibraryMap, {
                    keyPath: "albumId",
                });
            },
        });
    }

    async get(storeName: AlbumStoreNames, albumId: string) {
        return (await this.db).get(storeName, albumId);
    }

    async set(storeName: AlbumStoreNames, payload: AlbumLibraryMapItem) {
        return (await this.db).put(storeName, payload);
    }

    async addAvailableLibrary(albumId: string, libraryUrl: string) {
        const currentAvailableLibraryUrls =
            (await this.get(AlbumStoreNames.AlbumLibraryMap, albumId))?.availableLibraries || [];
        if (!currentAvailableLibraryUrls.includes(libraryUrl)) {
            const newAvailableLibraryUrls = [...currentAvailableLibraryUrls, libraryUrl];
            return this.set(AlbumStoreNames.AlbumLibraryMap, {
                albumId,
                availableLibraries: newAvailableLibraryUrls,
            });
        }
    }

    async dropAllStores() {
        return await deleteDB(DB_NAME);
    }
}

export default new Album();
