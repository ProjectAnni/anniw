import { atom } from "recoil";
import { handleResponseBody } from "./request";

export const AnnilCredentials = atom<AnnilToken[]>({
    key: "AnnilCredentials",
    default: fetch("/api/credential").then((res) => handleResponseBody(res)),
});
