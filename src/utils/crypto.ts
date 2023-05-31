import sha256_cryptojs from "crypto-js/sha256";

class TextDigestError extends Error {}

export async function sha256(text: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Support in Safari before version 11 was using the crypto.webkitSubtle prefix.
    if (!window.crypto.subtle && !window.crypto.webkitSubtle) {
        return sha256_cryptojs(text).toString();
        // throw new TextDigestError("浏览器版本过低或没有运行在HTTPS环境");
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
