
const enchRecipes = [
    {
        name: 'Lightless Force',
        ingredients: [
            {
                name: 'Eternal Crystal',
                count: 2
            },
            {
                name: 'Sacred Shard',
                count: 3
            }
        ]
    },
    {
        name: 'Ascended Vigor',
        ingredients: [
            {
                name: 'Eternal Crystal',
                count: 2
            },
            {
                name: 'Sacred Shard',
                count: 3
            }
        ]
    },
    {
        name: 'Eternal Grace',
        ingredients: [
            {
                name: 'Eternal Crystal',
                count: 2
            },
            {
                name: 'Sacred Shard',
                count: 3
            }
        ]
    },
    {
        name: 'Sinful Revelation',
        ingredients: [
            {
                name: 'Eternal Crystal',
                count: 2
            },
            {
                name: 'Sacred Shard',
                count: 3
            }
        ]
    }
];

const alchRecipes = [
    {
        name: 'Spiritual Anti-Venom',
        ingredients: [
            {
                name: 'Death Blossom',
                count: 2
            }
        ]
    },
    {
        name: 'Potion of Spectral Strength',
        ingredients: [
            {
                name: 'Rising Glory',
                count: 5
            }
        ]
    },
    {
        name: 'Potion of Spectral Intellect',
        ingredients: [
            {
                name: 'Marrowroot',
                count: 5
            }
        ]
    },
    {
        name: 'Potion of Spectral Agility',
        ingredients: [
            {
                name: 'Widowbloom',
                count: 5
            }
        ]
    },
    {
        name: 'Potion of Deathly Fixation',
        ingredients: [
            {
                name: 'Widowbloom',
                count: 3
            },
            {
                name: "Vigil's Torch",
                isExact: true,
                count: 3
            }
        ]
    },
    {
        name: 'Potion of Empowered Exorcisms',
        ingredients: [
            {
                name: 'Widowbloom',
                count: 3
            },
            {
                name: "Marrowroot",
                count: 3
            }
        ]
    },
    {
        name: 'Potion of Divine Awakening',
        ingredients: [
            {
                name: 'Rising Glory',
                count: 3
            },
            {
                name: "Vigil's Torch",
                isExact: true,
                count: 3
            }
        ]
    },
    {
        name: 'Potion of Phantom Fire',
        ingredients: [
            {
                name: 'Marrowroot',
                count: 3
            },
            {
                name: 'Rising Glory',
                count: 3
            }
        ]
    },
    {
        name: 'Potion of Spiritual Clarity',
        ingredients: [
            {
                name: "Vigil's Torch",
                isExact: true,
                count: 5
            }
        ]
    },
    {
        name: 'Spectral Flask of Power',
        ingredients: [
            {
                name: 'Nightshade',
                isExact: true,
                count: 3
            },
            {
                name: 'Rising Glory',
                count: 4
            },
            {
                name: 'Marrowroot',
                count: 4
            },
            {
                name: 'Widowbloom',
                count: 4
            }
        ]
    },
    {
        name: 'Spectral Flask of Stamina',
        ingredients: [
            {
                name: 'Nightshade',
                isExact: true,
                count: 1
            },
            {
                name: 'Rising Glory',
                count: 3
            },
            {
                name: 'Marrowroot',
                count: 3
            }
        ]
    },
];

const leatRecipes = [
    {
        name: 'Heavy Desolate Armor Kit',
        ingredients: [
            {
                name: 'Heavy Desolate Leather',
                count: 8
            },
            {
                name: 'Penumbra Thread',
                count: 4
            }
        ]
    },
];

const recipes = [
    // {
    //     name: 'Spectral Flask of Power',
    //     ingredients: [
    //         {
    //             name: 'Nightshade',
    //             count: 3
    //         },
    //         {
    //             name: 'Rising Glory',
    //             count: 4
    //         },
    //         {
    //             name: 'Marrowroot',
    //             count: 4
    //         },
    //         {
    //             name: 'Widowbloom',
    //             count: 4
    //         }
    //     ]
    // }
];

module.exports = {
    enchRecipes,
    alchRecipes,
    leatRecipes,
};