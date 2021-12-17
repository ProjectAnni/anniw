export interface TrackInfo {
    title: string;
    artist: string;
    type: string;
    tags: string[];
}

export interface TrackInfoWithAlbum extends TrackInfo {
    // track_id 与 disc_id 均为从 1 开始
    trackId: number;
    discId: number;
    albumId: string;
}

export interface DiscInfo {
    // meta 仓库中为空时返回所属 Album 的 title
    title: string;
    artist: string;
    catalog: string;
    tags: string[];
    type: string;
    tracks: TrackInfo[];
}

export interface AlbumInfo {
    albumId: string;
    title: string;
    edition?: string;
    catalog: string;
    artist: string;
    date: string;
    tags: string[];
    type: string;
    discs: DiscInfo[];
}
