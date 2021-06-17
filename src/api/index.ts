import { atom, selector } from "recoil";
import { FEATURE_2FA, FEATURE_CLOSE, FEATURE_INVITE } from "./features";

export const SiteInfoState = atom<SiteInfo>({
  key: "SiteInfoState",
  default: (async (): Promise<SiteInfo> => {
    if (process.env.NODE_ENV === "production") {
      // TODO: fetch from Anniv server
      return Promise.resolve({} as SiteInfo);
    } else {
      return {
        site_name: "Yesterday17's Anni Server",
        description: "Welcome!!",
        protocol_version: "1",
        features: ["2fa"],
      };
    }
  })(),
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
