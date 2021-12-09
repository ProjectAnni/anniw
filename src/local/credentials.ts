import { atom } from "recoil";
import { AnnilToken } from "@/types/common";

export const AnnilLocalCredentials = atom<AnnilToken[]>({
    key: "AnnilCredentials",
    default: [],
});
