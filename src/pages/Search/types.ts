import { AlbumInfo, TrackInfoWithAlbum } from "@/types/common";

export interface SearchResult {
    albums?: AlbumInfo[];
    tracks?: TrackInfoWithAlbum[];
}

export enum SearchType {
    TRACK = 'TRACK',
    ALBUM = 'ALBUM',
}
