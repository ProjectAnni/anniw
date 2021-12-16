import { deleteDB, openDB } from "idb";
import type { DBSchema, IDBPDatabase } from "idb";

const DB_VERSION = 1;
const DB_NAME = "anniw_cache";
const TABLE_NAME = "cache";

interface CacheDB extends DBSchema {
    [TABLE_NAME]: {
        key: string;
        value: {
            value: any;
            time: number;
        };
    };
}

class Cache {
    db: Promise<IDBPDatabase<CacheDB>>;

    constructor() {
        this.db = openDB<CacheDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                if (oldVersion) {
                    db.deleteObjectStore(TABLE_NAME);
                }
                db.createObjectStore(TABLE_NAME);
            },
        });
    }

    async get(key: string) {
        const value = await (await this.db).get(TABLE_NAME, key);
        return value ? value.value : null;
    }

    async set(key: string, value: any) {
        return (await this.db).put(
            TABLE_NAME,
            {
                value,
                time: Date.now(),
            },
            key
        );
    }

    async delete(key: string) {
        return (await this.db).delete(TABLE_NAME, key);
    }

    async dropAllStores() {
        return await deleteDB(DB_NAME);
    }
}

export default new Cache();
