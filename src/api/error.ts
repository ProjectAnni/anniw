export class AnnivError extends Error {
    constructor(code: number, message?: string) {
        super(`Anniv error ${code}: ${message}`);
    }
}
