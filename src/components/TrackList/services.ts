import { groupBy } from "lodash";
import { AnnilToken } from "@/types/common";
import { default as AlbumDB } from "@/db/album";
import { TrackItem } from "./types";

export async function getAvailableLibraryForTrack(
    track: TrackItem,
    allCredentials: AnnilToken[]
): Promise<AnnilToken | undefined> {
    const { albumId } = track;
    const availableLibraries = await AlbumDB.getAvailableLibraries(albumId);
    if (availableLibraries.length > 0) {
        const credentialUrlMap = groupBy(
            allCredentials.filter((c) => availableLibraries.includes(c.url)),
            "url"
        );
        const librariesByPriority = availableLibraries.sort(
            (a, b) => credentialUrlMap[b][0].priority - credentialUrlMap[a][0].priority
        );
        return credentialUrlMap[librariesByPriority[0]][0];
    }
}

export function getPlayUrlForTrack(track: TrackItem, credential: AnnilToken) {
    const { albumId, discIndex, trackIndex } = track;
    const { url, token } = credential;
    return `${url}/${albumId}/${discIndex + 1}/${trackIndex + 1}?auth=${token}`;
}

export function getCoverUrlForTrack(track: TrackItem, credential: AnnilToken) {
    const { albumId } = track;
    const { url, token } = credential;
    return `${url}/${albumId}/cover?auth=${token}`;
}