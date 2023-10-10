import { TagType } from "@/types/common";

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ArtistParserReader {
    data: string;
    idx: number;
}

export interface Artist {
    name: string;
    children: Artist[];
}

function readArtist(reader: ArtistParserReader) {
    const res: Artist = {
        name: "",
        children: [],
    };
    // Read artist name
    while (reader.idx < reader.data.length) {
        if (reader.data[reader.idx] === "、") {
            if (reader.data[reader.idx + 1] === "、") {
                reader.idx += 1;
                res.name = res.name + "、";
            } else {
                break;
            }
        } else if (reader.data[reader.idx] === "（" || reader.data[reader.idx] === "）") {
            break;
        } else {
            res.name = res.name + reader.data[reader.idx];
        }
        reader.idx += 1;
    }
    console.assert(res.name !== "", "Artist parse error: empty artist name");
    // Read children
    if (reader.data[reader.idx] === "（") {
        reader.idx += 1;
        do {
            res.children.push(readArtist(reader));
            reader.idx += 1;
        } while (reader.data[reader.idx - 1] === "、");
        console.assert(
            reader.data[reader.idx - 1] === "）",
            `Artist parse error: missing ) at ${reader.idx}`
        );
    }
    return res;
}

function readArtists(reader: ArtistParserReader) {
    const res = [];
    res.push(readArtist(reader));
    while (reader.data[reader.idx] === "、") {
        reader.idx += 1;
        res.push(readArtist(reader));
    }
    return res;
}

export function parseArtists(artistStr: string) {
    return readArtists({
        data: artistStr,
        idx: 0,
    });
}

const tagPrefixes: TagType[] = [
    "animation",
    "artist",
    "category",
    "default",
    "game",
    "group",
    "organization",
    "project",
    "series",
];

export interface ParsedTag {
    type: TagType;
    name: string;
}

function parseTag(tagString: string): ParsedTag {
    if (!tagString.includes(":")) {
        return {
            type: "default",
            name: tagString,
        };
    }
    const [prefix, ...suffix] = tagString.split(":");
    if (!tagPrefixes.includes(prefix as TagType)) {
        return {
            type: "default",
            name: tagString,
        };
    }
    return {
        type: prefix as TagType,
        name: suffix.join(""),
    };
}

export function parseTags(tags: string[]): ParsedTag[] {
    return tags.map(parseTag);
}

const requestIdleCallback = window.requestIdleCallback || window.setTimeout;

export { requestIdleCallback };
