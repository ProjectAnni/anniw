import { atom, selector } from "recoil";
import { FEATURE_2FA, FEATURE_CLOSE, FEATURE_INVITE } from "./features";
import { handleResponseBody } from "./request";

export const SiteInfoState = atom<SiteInfo>({
    key: "SiteInfoState",
    default: fetch("/api/info").then((res) => handleResponseBody(res)),
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
