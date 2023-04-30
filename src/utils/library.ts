import { groupBy } from "lodash";
import { DiscIdentifier, AnnilToken, PlayQueueItem, TrackIdentifier } from "@/types/common";
import { default as AlbumDB } from "@/db/album";

function isTokenAvailableForShare(token: string, albumId: string): boolean {
    const tokenPayload = JSON.parse(window.atob(token.split(".")[1]));
    const share = tokenPayload?.share;
    const allowed: string[] | null | undefined = share?.allowed;
    return share && (!allowed || allowed.includes(albumId));
}

export function getAvailableLibraryForAlbum(
    albumId: string,
    allCredentials: AnnilToken[],
    needSharePermission = false
) {
    return getAvailableLibraryForTrack({ albumId }, allCredentials, needSharePermission);
}

export async function getAvailableLibraryForTrack<T extends { albumId: string } = PlayQueueItem>(
    track: T,
    allCredentials: AnnilToken[],
    needSharePermission = false
): Promise<AnnilToken | undefined> {
    const { albumId } = track;
    const availableLibraries = await AlbumDB.getAvailableLibraries(albumId);
    if (availableLibraries.length > 0) {
        const credentialUrlMap = groupBy(
            allCredentials
                .filter((c) => (needSharePermission ? isTokenAvailableForShare(c.token, albumId) : true))
                .filter((c) => availableLibraries.includes(c.url)),
            "url"
        );
        const librariesByPriority = availableLibraries
            .filter((lib) => Object.keys(credentialUrlMap).includes(lib))
            .sort((a, b) => credentialUrlMap[b][0].priority - credentialUrlMap[a][0].priority);
        return credentialUrlMap[librariesByPriority[0]]?.[0];
    }
}

export function getPlayUrlForTrack<T extends TrackIdentifier>(track: T, credential: AnnilToken) {
    const { albumId, discId, trackId } = track;
    const { url, token } = credential;
    return `${url}/${albumId}/${discId}/${trackId}?auth=${token}`;
}

export function getCoverUrlForTrack<T extends DiscIdentifier>(track: T, credential: AnnilToken) {
    const { albumId, discId } = track;
    const { url } = credential;
    return discId ? `${url}/${albumId}/${discId}/cover` : `${url}/${albumId}/cover`;
}

export function isSameTrack<T extends TrackIdentifier, U extends TrackIdentifier>(
    trackA: T,
    trackB: U
) {
    return (
        trackA.albumId === trackB.albumId &&
        trackA.discId === trackB.discId &&
        trackA.trackId === trackB.trackId
    );
}
