const enchRecipes = [
  {
    name: "Lightless Force",
    ingredients: [
      {
        name: "Eternal Crystal",
        count: 2,
      },
      {
        name: "Sacred Shard",
        count: 3,
      },
    ],
  },
  {
    name: "Ascended Vigor",
    ingredients: [
      {
        name: "Eternal Crystal",
        count: 2,
      },
      {
        name: "Sacred Shard",
        count: 3,
      },
    ],
  },
  {
    name: "Eternal Grace",
    ingredients: [
      {
        name: "Eternal Crystal",
        count: 2,
      },
      {
        name: "Sacred Shard",
        count: 3,
      },
    ],
  },
  {
    name: "Sinful Revelation",
    ingredients: [
      {
        name: "Eternal Crystal",
        count: 2,
      },
      {
        name: "Sacred Shard",
        count: 3,
      },
    ],
  },
];

const alchRecipes = [
  {
    name: "Spiritual Anti-Venom",
    isExact: true,
    ingredients: [
      {
        name: "Death Blossom",
        isExact: true,
        count: 2,
      },
    ],
  },
  {
    name: "Potion of Spectral Strength",
    isExact: true,
    ingredients: [
      {
        name: "Rising Glory",
        isExact: true,
        count: 5,
      },
    ],
  },
  {
    name: "Potion of Spectral Intellect",
    isExact: true,
    ingredients: [
      {
        name: "Marrowroot",
        isExact: true,
        count: 5,
      },
    ],
  },
  {
    name: "Potion of Spectral Agility",
    isExact: true,
    ingredients: [
      {
        name: "Widowbloom",
        isExact: true,
        count: 5,
      },
    ],
  },
  {
    name: "Potion of Deathly Fixation",
    isExact: true,
    ingredients: [
      {
        name: "Widowbloom",
        isExact: true,
        count: 3,
      },
      {
        name: "Vigil's Torch",
        isExact: true,
        count: 3,
      },
    ],
  },
  {
    name: "Potion of Empowered Exorcisms",
    isExact: true,
    ingredients: [
      {
        name: "Widowbloom",
        isExact: true,
        count: 3,
      },
      {
        name: "Marrowroot",
        isExact: true,
        count: 3,
      },
    ],
  },
  {
    name: "Potion of Divine Awakening",
    isExact: true,
    ingredients: [
      {
        name: "Rising Glory",
        isExact: true,
        count: 3,
      },
      {
        name: "Vigil's Torch",
        isExact: true,
        count: 3,
      },
    ],
  },
  {
    name: "Potion of Phantom Fire",
    isExact: true,
    ingredients: [
      {
        name: "Marrowroot",
        isExact: true,
        count: 3,
      },
      {
        name: "Rising Glory",
        isExact: true,
        count: 3,
      },
    ],
  },
  {
    name: "Potion of Spiritual Clarity",
    isExact: true,
    ingredients: [
      {
        name: "Vigil's Torch",
        isExact: true,
        count: 5,
      },
    ],
  },
  {
    name: "Spectral Flask of Power",
    isExact: true,
    ingredients: [
      {
        name: "Nightshade",
        isExact: true,
        count: 3,
      },
      {
        name: "Rising Glory",
        isExact: true,
        count: 4,
      },
      {
        name: "Marrowroot",
        isExact: true,
        count: 4,
      },
      {
        name: "Widowbloom",
        isExact: true,
        count: 4,
      },
      {
        name: "Vigil's Torch",
        isExact: true,
        count: 4,
      },
    ],
  },
  {
    name: "Spectral Flask of Stamina",
    isExact: true,
    ingredients: [
      {
        name: "Nightshade",
        isExact: true,
        count: 1,
      },
      {
        name: "Rising Glory",
        isExact: true,
        count: 3,
      },
      {
        name: "Marrowroot",
        isExact: true,
        count: 3,
      },
    ],
  },
];

const leatRecipes = [
  {
    name: "Heavy Desolate Armor Kit",
    isExact: true,
    ingredients: [
      {
        name: "Heavy Desolate Leather",
        isExact: true,
        count: 8,
      },
      {
        name: "Penumbra Thread",
        isExact: true,
        count: 4,
      },
    ],
  },
];

module.exports = {
  enchRecipes,
  alchRecipes,
  leatRecipes,
};
