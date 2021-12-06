import { atom, selector } from "recoil";
import { SiteFeatures } from "../constants/site";
import { SiteInfo } from "../types/common";

export const SiteInfoState = atom<SiteInfo>({
    key: "SiteInfoState",
    default: {
        siteName: "",
        description: "",
        features: [],
        protocolVersion: "1",
    },
});

export const SiteCanRegister = selector({
    key: "SiteCanRegister",
    get: ({ get }) => {
        const { features } = get(SiteInfoState);
        // not close, or close but allow invite(invite overrides close)
        return !features.includes(SiteFeatures.CLOSE) || features.includes(SiteFeatures.INVITE);
    },
});

export const SiteEnabled2FA = selector({
    key: "SiteEnabled2FA",
    get: ({ get }) => {
        const { features } = get(SiteInfoState);
        return features.includes(SiteFeatures.TWO_FACTOR_AUTH);
    },
});
