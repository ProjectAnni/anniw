import { ExportedPlaylist, ExportedToken, ExportedTrackList } from "@/types/exported";
import {
    AlbumIdentifier, AlbumInfo,
    AlbumTitle,
    DiscIdentifier,
    PlayQueueItem,
    TrackIdentifier,
    TrackInfo,
    TrackInfoWithAlbum,
} from "@/types/common";

export function getCoverUrl(share: ExportedPlaylist): string {
    return share.tokens[0].server + "/" + share.cover.albumId + "/" + share.cover.discId + "/cover";
}

export function parsePlaylists(metadata: Record<string, AlbumInfo>, tokens: ExportedToken[], tracks: ExportedTrackList): PlayQueueItem[] {
    const items: PlayQueueItem[] = [];
    for (const trackId of tracks.tracks) {
        const trackIdentifier: TrackIdentifier = {
            albumId: tracks.albumId,
            discId: tracks.discId,
            trackId,
        };
        const token = tokens.find(t => tokenAvailableFor(t, trackIdentifier));
        const item: PlayQueueItem = {
            ...trackIdentifier,
            ...getTrackMeta(metadata, trackIdentifier),
            tags: [],
        };

        if (token) {
            item.playUrl = token.server + "/" + tracks.albumId + "/" + tracks.discId + "/" + trackId + "?auth=" + token.token;
            item.coverUrl = token.server + "/" + tracks.albumId + "/" + tracks.discId + "/cover";
        }

        items.push(item);
    }
    return items;
}

function getTrackMeta(meta: Record<string, AlbumInfo>, track: TrackIdentifier): TrackInfoWithAlbum {
    const albumInfo = meta[track.albumId];
    const trackInfo = albumInfo.discs[track.discId - 1].tracks[track.trackId - 1];
    if (!trackInfo.artist) {
        trackInfo.artist = "";
    }
    if (!trackInfo.type) {
        trackInfo.type = "normal";
    }
    return <DiscIdentifier & { trackId: number } & Required<TrackInfo> & AlbumTitle>{
        ...track,
        ...trackInfo,
        albumTitle: albumInfo.title,
    };
}

type ShareAudio = Record<AlbumIdentifier, Record<string, number[]>>

function tokenAvailableFor(token: ExportedToken, track: TrackIdentifier): boolean {
    const decoded = window.atob(token.token.split(".")[1]);
    const audios: ShareAudio = JSON.parse(decoded).audios;
    if (track.albumId in audios) {
        const discs = audios[track.albumId];
        if (track.discId.toString() in discs) {
            const tracks = discs[track.discId.toString()];
            return tracks.indexOf(track.trackId) !== -1;
        }
    }
    return false;
}
