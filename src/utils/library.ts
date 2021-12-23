import { groupBy } from "lodash";
import { AnnilToken } from "@/types/common";
import { default as AlbumDB } from "@/db/album";

export async function getAvailableLibraryForAlbum(
    albumId: string,
    allCredentials: AnnilToken[]
): Promise<AnnilToken | undefined> {
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
