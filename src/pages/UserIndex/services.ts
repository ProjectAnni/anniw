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
    old_password: string;
    new_password: string;
}

export async function changePassword({ old_password, new_password }: ChangePasswordParams) {
    return await request.patch("/api/user/password", {
        old_password: await sha256(old_password),
        new_password: await sha256(new_password),
    });
}
