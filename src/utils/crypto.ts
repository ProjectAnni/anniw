export async function sha256(text: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Support in Safari before version 11 was using the crypto.webkitSubtle prefix.
    if (!window.crypto.subtle && !window.crypto.webkitSubtle) {
        const sha256 = (await import("crypto-js/sha256")).default;
        return sha256(text).toString();
    } else {
        const digestedBuffer = await window.crypto.subtle.digest(
            "SHA-256",
            new TextEncoder().encode(text)
        );
        return Array.from(new Uint8Array(digestedBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }
}
