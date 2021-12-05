import { atom, selector } from "recoil";
import { SiteInfo } from "../types/common";
import { FEATURE_2FA, FEATURE_CLOSE, FEATURE_INVITE } from "./features";
import request from "./request";

export const SiteInfoState = atom<SiteInfo>({
    key: "SiteInfoState",
    default: request.get("/api/info"),
});

export const SiteCanRegister = selector({
    key: "SiteCanRegister",
    get: ({ get }) => {
        const { features } = get(SiteInfoState);
        // not close, or close but allow invite(invite overrides close)
        return !features.includes(FEATURE_CLOSE) || features.includes(FEATURE_INVITE);
    },
});

export const SiteEnabled2FA = selector({
    key: "SiteEnabled2FA",
    get: ({ get }) => {
        const { features } = get(SiteInfoState);
        return features.includes(FEATURE_2FA);
    },
});
