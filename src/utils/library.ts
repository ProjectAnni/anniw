import { groupBy } from "lodash";
import { AlbumDiscIdentifier, AnnilToken, PlayQueueItem, TrackIdentifier } from "@/types/common";
import { default as AlbumDB } from "@/db/album";

export function getAvailableLibraryForAlbum(albumId: string, allCredentials: AnnilToken[]) {
    return getAvailableLibraryForTrack({ albumId }, allCredentials);
}

export async function getAvailableLibraryForTrack<T extends { albumId: string } = PlayQueueItem>(
    track: T,
    allCredentials: AnnilToken[]
): Promise<AnnilToken | undefined> {
    const { albumId } = track;
    const availableLibraries = await AlbumDB.getAvailableLibraries(albumId);
    if (availableLibraries.length > 0) {
        const credentialUrlMap = groupBy(
            allCredentials.filter((c) => availableLibraries.includes(c.url)),
            "url"
        );
        const librariesByPriority = availableLibraries
            .filter((lib) => Object.keys(credentialUrlMap).includes(lib))
            .sort((a, b) => credentialUrlMap[b][0].priority - credentialUrlMap[a][0].priority);
        return credentialUrlMap[librariesByPriority[0]][0];
    }
}

export function getPlayUrlForTrack<T extends TrackIdentifier>(track: T, credential: AnnilToken) {
    const { albumId, discId, trackId } = track;
    const { url, token } = credential;
    return `${url}/${albumId}/${discId}/${trackId}?auth=${token}`;
}

export function getCoverUrlForTrack<T extends AlbumDiscIdentifier>(
    track: T,
    credential: AnnilToken
) {
    const { albumId, discId } = track;
    const { url } = credential;
    return discId ? `${url}/${albumId}/${discId}/cover` : `${url}/${albumId}/cover`;
}
