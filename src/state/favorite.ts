import { atom, selector } from "recoil";
import { groupBy } from "lodash";
import { FavoriteTrackItem } from "@/types/common";

export const FavoriteTracksState = atom<FavoriteTrackItem[]>({
    key: "FavoriteTracksState",
    default: [],
});

export const FavoriteTrackAlbumMap = selector({
    key: "FavoriteTrackAlbumMap",
    get: ({ get }) => {
        return groupBy(get(FavoriteTracksState), "albumId");
    },
});
