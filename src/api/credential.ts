import { atom } from "recoil";
import { AnnilToken } from "../types/common";
import request from "./request";

export const AnnilCredentials = atom<AnnilToken[]>({
    key: "AnnilCredentials",
    default: request.get("/api/credential"),
});
