export const userMocks = [
    {
        url: "/api/user/login",
        method: "post",
        response: () => {
            return {
                status: 0,
                data: {
                    user_id: "1",
                    username: "Test-User",
                    email: "mail@example.com",
                    nickname: "Test-User",
                },
            };
        },
    },
    {
        url: "/api/user/info",
        method: "get",
        response: () => {
            return {
                status: 0,
                data: {
                    user_id: "1",
                    username: "Test-User",
                    email: "mail@example.com",
                    nickname: "Test-User",
                },
            };
        },
    },
    {
        url: "/api/user/logout",
        method: "post",
        response: () => {
            return {
                status: 0,
                data: {},
            };
        },
    },
];
