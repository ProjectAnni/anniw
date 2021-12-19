import { TrackItem } from "@/components/TrackList/types";
import { AnnilToken } from "@/types/common";

export function getAudioUrl(credential: AnnilToken, track: TrackItem) {
    const url = `${credential.url}/${track.albumId}/${track.discIndex + 1}/${
        track.trackIndex + 1
    }?auth=${credential.token}`;
    if (window.MediaSource) {
        const mediaSource = new MediaSource();
        mediaSource.addEventListener("sourceopen", () => {
            fetch(url, { cache: "force-cache" }).then((resp) => {
                // set source buffer mime type
                const mime = resp.headers.get("Content-Type") || "audio/aac";
                const duration = resp.headers.get("X-Duration-Seconds") || "300";
                const sourceBuffer = mediaSource.addSourceBuffer(mime);

                // set media source duration
                mediaSource.duration = Number(duration);

                // get body as reader
                const reader = resp.body?.getReader();
                const appendBuffer = ({
                    done,
                    value,
                }: ReadableStreamDefaultReadResult<Uint8Array>) => {
                    if (!done && value) {
                        // body not finished, append buffer
                        sourceBuffer.appendBuffer(value);
                    } else {
                        // update duration after stream ends
                        mediaSource.endOfStream();
                    }
                };

                // read body on source buffer update ends
                sourceBuffer.addEventListener("updateend", () => reader?.read().then(appendBuffer));
                // read body once
                reader?.read().then(appendBuffer);
            });
        });
        return URL.createObjectURL(mediaSource);
    } else {
        return url;
    }
}

export function getCoverUrl(credential: AnnilToken, track: TrackItem) {
    return `${credential.url}/${track.albumId}/cover?auth=${credential.token}`;
}
