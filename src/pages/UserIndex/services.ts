import request from "@/api/request";
import { UserInfo } from "@/types/common";
import { sha256 } from "@/utils/crypto";

interface PatchIntroParams {
    nickname: string;
    avatar: string;
}

export async function patchIntro({ nickname, avatar }: PatchIntroParams) {
    await request.patch("/api/user/intro", {
        nickname,
        avatar,
    });
    return await request.get<UserInfo>("/api/user/info");
}

interface ChangePasswordParams {
    oldPassword: string;
    newPassword: string;
}

export async function changePassword({ oldPassword, newPassword }: ChangePasswordParams) {
    return await request.patch("/api/user/password", {
        oldPassword: await sha256(oldPassword),
        newPassword: await sha256(newPassword),
    });
}
