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

const requestIdleCallback = window.requestIdleCallback || window.setTimeout;

export { requestIdleCallback };
