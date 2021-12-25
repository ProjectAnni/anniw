import { atom, selector } from "recoil";

export const Tags = atom<string[]>({
    key: "Tags",
    default: [],
});

export const TagGraph = atom<Record<string, string[]>>({
    key: "TagDeps",
    default: {},
});

export const TagIncludedBy = selector({
    key: "TagIncludedBy",
    get: ({ get }) => {
        const tagGraph = get(TagGraph);
        console.log(tagGraph);
        let res: Record<string, string> = {};
        for (let u in tagGraph) {
            if (tagGraph.hasOwnProperty(u)) {
                tagGraph[u].forEach((v) => {
                    res[v] = u;
                });
            }
        }
        return res;
    },
});

export const RootTags = selector({
    key: "RootTags",
    get: ({ get }) => {
        const tags = get(Tags);
        const tagIncludedBy = get(TagIncludedBy);
        let res: string[] = [];
        tags.forEach((x) => {
            if (!tagIncludedBy[x]) {
                res.push(x);
            }
        });
        return res;
    },
});
