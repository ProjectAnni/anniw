export const credentialsMocks = [
    {
        url: "/api/credential",
        method: "get",
        response: () => {
            return {
                status: 0,
                data: [
                    {
                        id: "c002a816-7aa2-48e7-8281-c8c44c574dbd",
                        name: "Test Library",
                        url: "https://library.example.com",
                        token: "xxxxx",
                        priority: 1,
                    },
                ],
            };
        },
    },
    {
        url: "/api/credential",
        method: "delete",
        response: () => {
            return {
                status: 0,
            };
        },
    },
];
