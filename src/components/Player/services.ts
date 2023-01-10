import request from "@/api/request";
import { TrackIdentifier } from "@/types/common";

type SongPlayRecord = {
    track: TrackIdentifier;
    at: number[];
};

export function recordTrackPlayback(record: SongPlayRecord): Promise<void> {
    return request.post("/api/stat", [record]);
}
