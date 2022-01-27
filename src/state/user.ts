import { atom, selector } from "recoil";
import { LoginStatus, UserInfo } from "@/types/common";

export const CurrentUserInfo = atom<UserInfo | null>({
    key: "CurrentUserInfo",
    default: null,
});

export const IsLoadingUserInfo = atom<boolean>({
    key: "IsLoadingUserInfo",
    default: true,
});

export const IsLoadedExtendUserInfo = atom<boolean>({
    key: "IsLoadedExtendUserInfo",
    default: false,
});

export const CurrentLoginStatus = selector({
    key: "CurrentLoginStatus",
    get: ({ get }) => {
        const userInfo = get(CurrentUserInfo);
        const isLoadingUserInfo = get(IsLoadingUserInfo);
        if (isLoadingUserInfo) {
            return LoginStatus.UNKNOWN;
        }
        return userInfo !== null ? LoginStatus.LOGGED_IN : LoginStatus.LOGGED_OUT;
    },
});
