import { atom } from "recoil";

export const AnnilLocalCredentials = atom<AnnilToken[]>({
  key: "AnnilCredentials",
  default: [],
});