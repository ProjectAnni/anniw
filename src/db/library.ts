import { deleteDB, openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

const DB_VERSION = 1;
const DB_NAME = "anniw_library";
const TABLE_NAME = "library_info";

interface LibraryInfo {
    url: string;
    lastSync?: Date;
    serverLastUpdate?: Date;
    albums: string[];
    albumCount: number;
}

interface LibraryDB extends DBSchema {
    [TABLE_NAME]: {
        key: string;
        value: LibraryInfo;
    };
}

class Library {
    db: Promise<IDBPDatabase<LibraryDB>>;

    constructor() {
        this.db = openDB<LibraryDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                // if (oldVersion) {
                //     db.deleteObjectStore(TABLE_NAME);
                // }
                db.createObjectStore(TABLE_NAME, {
                    keyPath: "url",
                });
            },
        });
    }

    async get(url: string) {
        return (await this.db).get(TABLE_NAME, url);
    }

    async set(info: LibraryInfo) {
        return (await this.db).put(TABLE_NAME, info);
    }

    async delete(url: string) {
        return (await this.db).delete(TABLE_NAME, url);
    }

    async dropAllStores() {
        return await deleteDB(DB_NAME);
    }
}

export default new Library();
