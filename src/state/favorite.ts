import { atom, selector } from "recoil";
import { groupBy } from "lodash";
import { TrackInfoWithAlbum } from "@/types/common";

export const FavoriteTracksState = atom<TrackInfoWithAlbum[]>({
    key: "FavoriteTracksState",
    default: [],
});

export const FavoriteTrackAlbumMap = selector({
    key: "FavoriteTrackAlbumMap",
    get: ({ get }) => {
        return groupBy(get(FavoriteTracksState), "albumId");
    },
});
