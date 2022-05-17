import { useCallback, useEffect, useState } from "react";

class Storage {
    public static listeners = new Map<string, Set<(newValue: string) => void>>();

    public static get(key: string): string | null {
        return localStorage.getItem(key);
    }

    public static set(key: string, value: string): void {
        localStorage.setItem(key, value);
        Storage.listeners.get(key)?.forEach((callback) => callback(value));
    }

    public static remove(key: string): void {
        localStorage.removeItem(key);
    }

    public static addListener(key: string, callback: (value: string) => void): () => void {
        if (!Storage.listeners.has(key)) {
            Storage.listeners.set(key, new Set());
        }

        Storage.listeners.get(key)!.add(callback);
        return () => {
            Storage.listeners.get(key)!.delete(callback);
        };
    }
}

const useLocalStorageValue = (key: string, defaultValue = "") => {
    const [value, setValue] = useState(Storage.get(key) || defaultValue);
    const set = useCallback(
        (newValue: string) => {
            Storage.set(key, newValue);
        },
        [key]
    );
    useEffect(() => {
        const remove = Storage.addListener(key, setValue);

        return () => {
            remove();
        };
    }, [key]);
    return [value, set] as const;
};

export default useLocalStorageValue;
