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
        const res: Record<string, string> = {};
        for (const u of Object.keys(tagGraph)) {
            tagGraph[u].forEach((v) => {
                res[v] = u;
            })
        }
        return res;
    },
});

export const RootTags = selector({
    key: "RootTags",
    get: ({ get }) => {
        const tags = get(Tags);
        const tagIncludedBy = get(TagIncludedBy);
        const res: string[] = [];
        tags.forEach((x) => {
            if (!tagIncludedBy[x]) {
                res.push(x);
            }
        });
        return res;
    },
});
