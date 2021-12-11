class Storage {
    get<T = any>(key: string): T | null {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value);
            } catch (e) {
                return null;
            }
        }
        return null;
    }
    set(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value));
    }
    delete(key: string): void {
        localStorage.removeItem(key);
    }
}

export default new Storage();
