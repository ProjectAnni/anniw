export default [
    {
        url: "/api/meta/album",
        method: "get",
        response: ({ query }) => {
            const { "id[]": id } = query;
            return {
                status: 0,
                message: "OK",
                data: {
                    [id]: {
                        album_id: id,
                        title: "THE IDOLM@STER LIVE THE@TER HARMONY 04",
                        edition: "通常",
                        catalog: "LACA-15434",
                        artist: "エターナルハーモニー（如月千早（今井麻美）、エミリー スチュアート（郁原ゆう）、ジュリア（愛美）、徳川まつり（諏訪彩花）、豊川風花（末柄里恵））",
                        date: "2014-09-24",
                        tags: ["THE IDOLM@STER LIVE THE@TER HARMONY"],
                        type: "normal",
                        discs: [
                            {
                                title: "THE IDOLM@STER LIVE THE@TER HARMONY 04",
                                artist: "エターナルハーモニー（如月千早（今井麻美）、エミリー スチュアート（郁原ゆう）、ジュリア（愛美）、徳川まつり（諏訪彩花）、豊川風花（末柄里恵））",
                                catalog: "LACA-15434",
                                tags: [],
                                type: "normal",
                                tracks: [
                                    {
                                        title: "Eternal Harmony",
                                        artist: "エターナルハーモニー（如月千早（今井麻美）、エミリー スチュアート（郁原ゆう）、ジュリア（愛美）、徳川まつり（諏訪彩花）、豊川風花（末柄里恵））",
                                        type: "normal",
                                        tags: [],
                                    },
                                    {
                                        title: "カーニヴァル・ジャパネスク",
                                        artist: "徳川まつり（諏訪彩花）",
                                        type: "normal",
                                        tags: [],
                                    },
                                    {
                                        title: "プラリネ",
                                        artist: "ジュリア（愛美）",
                                        type: "normal",
                                        tags: [],
                                    },
                                    {
                                        title: "bitter sweet",
                                        artist: "豊川風花（末柄里恵）",
                                        type: "normal",
                                        tags: [],
                                    },
                                    {
                                        title: "君だけの欠片",
                                        artist: "エミリー スチュアート（郁原ゆう）",
                                        type: "normal",
                                        tags: [],
                                    },
                                    {
                                        title: "Just be myself!!",
                                        artist: "如月千早（今井麻美）",
                                        type: "normal",
                                        tags: [],
                                    },
                                    {
                                        title: "Welcome!!",
                                        artist: "エターナルハーモニー（如月千早（今井麻美）、エミリー スチュアート（郁原ゆう）、ジュリア（愛美）、徳川まつり（諏訪彩花）、豊川風花（末柄里恵））",
                                        type: "normal",
                                        tags: [],
                                    },
                                ],
                            },
                        ],
                    },
                },
            };
        },
    },
];
