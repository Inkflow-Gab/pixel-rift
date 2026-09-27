// World definitions - each world maps to specific asset packs
// All paths are relative to public/assets/packs/
const P = (pack, path) => `assets/packs/${pack}/${path}`;

export const WORLDS = [
  {
    id: 'farm',
    name: 'Sunnyside Farm',
    desc: 'A peaceful farm overrun by slimes and skeletons.',
    icon: P('Cute_Fantasy_Free', 'Animals/Cow/Cow.png'),
    music: P('medieval-fantasy', 'music/theme-1.ogg'),
    background: P('backgrounds', 'backgrounds/1.png'),
    ground: P('Cute_Fantasy_Free', 'Tiles/Grass_Middle.png'),
    platform: P('Cute_Fantasy_Free', 'Tiles/Path_Middle.png'),
    decor: [
      { sprite: P('Cute_Fantasy_Free', 'Outdoor decoration/Oak_Tree.png'), x: 0.1, y: 0.75, scale: 1.5 },
      { sprite: P('Cute_Fantasy_Free', 'Outdoor decoration/House_1_Wood_Base_Blue.png'), x: 0.85, y: 0.6, scale: 1.2 },
      { sprite: P('Cute_Fantasy_Free', 'Outdoor decoration/Fences.png'), x: 0.3, y: 0.85, scale: 1.0 },
      { sprite: P('Cute_Fantasy_Free', 'Outdoor decoration/Bridge_Wood.png'), x: 0.6, y: 0.8, scale: 1.0 },
    ],
    ambient: [
      { sprite: P('Cute_Fantasy_Free', 'Animals/Chicken/Chicken.png'), x: 0.2, y: 0.88 },
      { sprite: P('Cute_Fantasy_Free', 'Animals/Pig/Pig.png'), x: 0.5, y: 0.88 },
      { sprite: P('Cute_Fantasy_Free', 'Animals/Sheep/Sheep.png'), x: 0.7, y: 0.88 },
    ],
    enemies: [
      { sprite: P('Cute_Fantasy_Free', 'Enemies/Slime_Green.png'), hp: 2, speed: 40, behavior: 'walker', score: 100, scale: 0.8 },
      { sprite: P('Cute_Fantasy_Free', 'Enemies/Skeleton.png'), hp: 3, speed: 50, behavior: 'walker', score: 150, scale: 0.8 },
    ],
    collectibles: [
      { sprite: P('medieval-fantasy', 'items/gold-&-gem/coin.png'), value: 10, type: 'coin' },
      { sprite: P('medieval-fantasy', 'items/food-&-potion/food.png'), value: 1, type: 'health' },
    ],
    boss: { sprite: P('medieval-fantasy', 'monsters/king skeleton.png'), hp: 15, speed: 60, score: 1000, scale: 1.5 },
    levelLength: 3000,
    difficulty: 1.0,
    bgColor: 0x87ceeb,
  },
  {
    id: 'medieval',
    name: 'Medieval Keep',
    desc: 'A dark castle filled with goblins and the undead.',
    icon: P('32rogues-0.5.0', '32rogues/rogues.png'),
    music: P('rpg-battle-system', 'music/theme-1.ogg'),
    background: P('rpg-battle-system', 'backgrounds/1-night.png'),
    ground: P('32rogues-0.5.0', '32rogues/tiles.png'),
    platform: P('32rogues-0.5.0', '32rogues/tiles.png'),
    decor: [
      { sprite: P('medieval-fantasy', 'background-elements/17.png'), x: 0.15, y: 0.7, scale: 2 },
      { sprite: P('medieval-fantasy', 'background-elements/21.png'), x: 0.5, y: 0.7, scale: 2 },
      { sprite: P('medieval-fantasy', 'background-elements/1.png'), x: 0.8, y: 0.75, scale: 2 },
    ],
    ambient: [
      { sprite: P('32rogues-0.5.0', '32rogues/animals.png'), x: 0.3, y: 0.88 },
    ],
    enemies: [
      { sprite: P('medieval-fantasy', 'monsters/goblin.png'), hp: 3, speed: 60, behavior: 'walker', score: 150, scale: 1.2 },
      { sprite: P('medieval-fantasy', 'monsters/skeleton.png'), hp: 4, speed: 50, behavior: 'walker', score: 200, scale: 1.2 },
      { sprite: P('medieval-fantasy', 'monsters/slim.png'), hp: 2, speed: 80, behavior: 'charger', score: 100, scale: 1.2 },
    ],
    collectibles: [
      { sprite: P('medieval-fantasy', 'items/gold-&-gem/coin.png'), value: 10, type: 'coin' },
      { sprite: P('medieval-fantasy', 'items/gold-&-gem/gem-1.png'), value: 25, type: 'gem' },
      { sprite: P('medieval-fantasy', 'items/food-&-potion/potion.png'), value: 1, type: 'health' },
    ],
    boss: { sprite: P('medieval-fantasy', 'monsters/dragon.png'), hp: 25, speed: 70, score: 2000, scale: 1.5 },
    levelLength: 3500,
    difficulty: 1.3,
    bgColor: 0x1a1a2e,
  },
  {
    id: 'prehistoric',
    name: 'Prehistoric Isle',
    desc: 'A jungle island ruled by dinosaurs.',
    icon: P('prehistoric-platformer', 'monsters/tyrannosaurus-1.png'),
    music: P('prehistoric-platformer', 'music/theme-1.ogg'),
    background: P('prehistoric-platformer', 'background-elements/sky-1.png'),
    ground: P('prehistoric-platformer', 'background-elements/grass-1.png'),
    platform: P('prehistoric-platformer', 'background-elements/rock-3.png'),
    decor: [
      { sprite: P('prehistoric-platformer', 'background-elements/mountain-1.png'), x: 0.2, y: 0.5, scale: 1.5 },
      { sprite: P('prehistoric-platformer', 'background-elements/forest-1.png'), x: 0.6, y: 0.6, scale: 1.2 },
      { sprite: P('prehistoric-platformer', 'background-elements/cloud-1.png'), x: 0.4, y: 0.2, scale: 1.0 },
    ],
    ambient: [
      { sprite: P('prehistoric-platformer', 'monsters/bat-1.png'), x: 0.3, y: 0.3 },
    ],
    enemies: [
      { sprite: P('prehistoric-platformer', 'monsters/bat-1.png'), hp: 2, speed: 100, behavior: 'flyer', score: 150, scale: 0.8 },
      { sprite: P('prehistoric-platformer', 'monsters/lizard-1.png'), hp: 4, speed: 70, behavior: 'walker', score: 200, scale: 0.8 },
      { sprite: P('prehistoric-platformer', 'monsters/mini-tyrannosaurus-1.png'), hp: 6, speed: 60, behavior: 'charger', score: 300, scale: 0.8 },
    ],
    collectibles: [
      { sprite: P('prehistoric-platformer', 'items/2.png'), value: 10, type: 'coin' },
      { sprite: P('prehistoric-platformer', 'items/7.png'), value: 1, type: 'health' },
    ],
    boss: { sprite: P('prehistoric-platformer', 'monsters/tyrannosaurus-1.png'), hp: 40, speed: 80, score: 3000, scale: 1.2 },
    levelLength: 4000,
    difficulty: 1.6,
    bgColor: 0x2d5a27,
  },
  {
    id: 'space',
    name: 'Starship Void',
    desc: 'An asteroid field in deep space. Side-scrolling shooter!',
    icon: P('space-shooter', 'ships/1.png'),
    music: P('space-shooter', 'music/1.ogg'),
    background: P('space-shooter', 'backgrounds/1.png'),
    ground: null,
    platform: null,
    decor: [
      { sprite: P('space-shooter', 'backgrounds/planet-1.png'), x: 0.3, y: 0.3, scale: 1.5 },
      { sprite: P('space-shooter', 'backgrounds/moon.png'), x: 0.7, y: 0.2, scale: 1.0 },
      { sprite: P('space-shooter', 'backgrounds/stars.png'), x: 0.5, y: 0.5, scale: 1.0 },
    ],
    ambient: [],
    enemies: [
      { sprite: P('space-shooter', 'ships/3.png'), hp: 2, speed: 80, behavior: 'shooter', score: 200, scale: 0.8 },
      { sprite: P('space-shooter', 'ships/5.png'), hp: 3, speed: 100, behavior: 'shooter', score: 250, scale: 0.8 },
      { sprite: P('space-shooter', 'backgrounds/meteor-1.png'), hp: 1, speed: 120, behavior: 'flyer', score: 100, scale: 0.8 },
    ],
    collectibles: [
      { sprite: P('space-shooter', 'items/gem-1.png'), value: 25, type: 'gem' },
      { sprite: P('space-shooter', 'items/power-up-1.png'), value: 1, type: 'powerup' },
    ],
    boss: { sprite: P('space-shooter', 'ships/8.png'), hp: 50, speed: 90, score: 5000, scale: 1.5 },
    levelLength: 5000,
    difficulty: 2.0,
    bgColor: 0x0a0a1a,
    shooter: true,
  },
  {
    id: 'western',
    name: 'Western Gulch',
    desc: 'A desert town where outlaws rule the streets.',
    icon: P('western-fps-2d', 'characters/15.png'),
    music: P('western-fps-2d', 'musics/theme-1.ogg'),
    background: P('western-fps-2d', 'background-elements/sky-background.png'),
    ground: P('western-fps-2d', 'background-elements/0-tileset-32x32.png'),
    platform: P('western-fps-2d', 'background-elements/rock-background.png'),
    decor: [
      { sprite: P('western-fps-2d', 'background-elements/cactus-1.png'), x: 0.15, y: 0.75, scale: 1.5 },
      { sprite: P('western-fps-2d', 'background-elements/tree-2.png'), x: 0.5, y: 0.6, scale: 1.2 },
      { sprite: P('western-fps-2d', 'background-elements/grave-1.png'), x: 0.8, y: 0.85, scale: 1.0 },
      { sprite: P('western-fps-2d', 'background-elements/barrel.png'), x: 0.35, y: 0.85, scale: 1.0 },
    ],
    ambient: [
      { sprite: P('western-fps-2d', 'animals/1.png'), x: 0.25, y: 0.88 },
    ],
    enemies: [
      { sprite: P('western-fps-2d', 'characters/16.png'), hp: 4, speed: 70, behavior: 'shooter', score: 250, scale: 1.2 },
      { sprite: P('western-fps-2d', 'characters/20.png'), hp: 5, speed: 60, behavior: 'walker', score: 300, scale: 1.2 },
      { sprite: P('medieval-fantasy', 'monsters/snake.png'), hp: 3, speed: 90, behavior: 'charger', score: 200, scale: 1.2 },
    ],
    collectibles: [
      { sprite: P('western-fps-2d', 'item/coin.png'), value: 10, type: 'coin' },
      { sprite: P('western-fps-2d', 'item/medikit.png'), value: 1, type: 'health' },
    ],
    boss: { sprite: P('medieval-fantasy', 'monsters/leonard.png'), hp: 35, speed: 80, score: 4000, scale: 1.5 },
    levelLength: 4000,
    difficulty: 1.8,
    bgColor: 0xd4a574,
  },
  {
    id: 'ninja',
    name: 'Ninja Temple',
    desc: 'An ancient temple guarded by shadow warriors.',
    icon: P('ninja-adventure', 'characters/1.png'),
    music: P('ninja-adventure', 'music/theme-1.ogg'),
    background: P('ninja-adventure', 'background-elements/snow.png'),
    ground: P('ninja-adventure', 'background-elements/tileset.png'),
    platform: P('ninja-adventure', 'background-elements/tileset.png'),
    decor: [
      { sprite: P('ninja-adventure', 'background-elements/plant.gif'), x: 0.2, y: 0.8, scale: 1.5 },
      { sprite: P('ninja-adventure', 'background-elements/flag.gif'), x: 0.6, y: 0.7, scale: 1.5 },
      { sprite: P('ninja-adventure', 'background-elements/flower.gif'), x: 0.8, y: 0.85, scale: 1.0 },
    ],
    ambient: [
      { sprite: P('ninja-adventure', 'characters/dog.png'), x: 0.3, y: 0.88 },
    ],
    enemies: [
      { sprite: P('ninja-adventure', 'monsters/1.png'), hp: 5, speed: 80, behavior: 'walker', score: 300, scale: 1.0 },
      { sprite: P('ninja-adventure', 'monsters/5.png'), hp: 6, speed: 100, behavior: 'charger', score: 350, scale: 1.0 },
      { sprite: P('ninja-adventure', 'monsters/10.png'), hp: 4, speed: 120, behavior: 'shooter', score: 400, scale: 1.0 },
    ],
    collectibles: [
      { sprite: P('ninja-adventure', 'items/coin-2.png'), value: 10, type: 'coin' },
      { sprite: P('ninja-adventure', 'items/heart.png'), value: 1, type: 'health' },
      { sprite: P('ninja-adventure', 'items/scroll-fire.png'), value: 1, type: 'powerup' },
    ],
    boss: { sprite: P('ninja-adventure', 'monsters/22.png'), hp: 60, speed: 100, score: 6000, scale: 1.5 },
    levelLength: 4500,
    difficulty: 2.5,
    bgColor: 0x2a2a3e,
  },
];

export function getWorld(idx) {
  return WORLDS[idx] || WORLDS[0];
}

export const TOTAL_STAGES = WORLDS.length * 2; // 2 stages per world
