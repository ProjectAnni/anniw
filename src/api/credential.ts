import { atom } from "recoil";
import { handleResponseBody } from "./request";

export interface AnnilToken {
  name: string,
  url: string,
  token: string,
  priority: number,
}

export const AnnilCredentials = atom<AnnilToken[]>({
  key: "AnnilCredentials",
  default: fetch("/api/credential").then(res => handleResponseBody(res)),
});