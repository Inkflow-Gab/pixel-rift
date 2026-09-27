# PIXEL RIFT — Design Doc

## Working Title
**Pixel Rift**

## Backstory / Lore
A cosmic tear has shattered the world into six floating **Rift Realms** — each a
self-contained pixel world with its own inhabitants, monsters, and music. You are
the **Riftwalker**, a dimension-hopping hero who jumps through portals to defeat
each realm's boss, restore the rift crystal, and stitch the world back together.

## Genre & Core Mechanic
2D action-platformer (with one side-scrolling shooter segment):
- **Run, jump, melee attack, ranged attack** (weapon-dependent)
- Defeat enemies, collect coins/gems/crops, grab power-ups
- Reach the portal at the end of each stage; defeat the boss to unlock the next world
- Progress (unlocked worlds, best score, settings) saved to `localStorage`

## The Six Worlds — Asset Pack Mapping
Every pack is used. Each world is themed around one primary pack, with supporting
packs woven in.

| # | World | Primary Pack(s) | Supporting Packs | Music |
|---|-------|-----------------|------------------|-------|
| 1 | **Sunnyside Farm** | Cute_Fantasy_Free (player, tiles, animals, decor, house) | MinifolksVillagers (NPCs), Mana Seed Farmer (farmer NPC/skin), Sunnyside (crops, chimney smoke, tileset), medieval-fantasy (coins, hearts, chests) | medieval-fantasy theme-1 |
| 2 | **Medieval Keep** | 32rogues (tiles, monsters, rogues, items) | medieval-fantasy (monsters, items, HUD), rpg-battle-system (chars, monsters, backgrounds, HUD bars), Monsters_Creatures_Fantasy (goblin/mushroom/skeleton enemies), Tiny RPG (Demon + Blood Monster as mini-bosses) | rpg-battle-system theme-1 |
| 3 | **Prehistoric Isle** | prehistoric-platformer (caverman player, dinos, items, backgrounds, tiles) | rpg-battle-system (bat/slime/reptile enemies), Super Pixel Effects (explosions) | prehistoric-platformer theme-1 |
| 4 | **Starship Void** | space-shooter (ships, shots, gems, backgrounds, HUD) | top-down-shooter (robot/tank enemies, weapons), Super Pixel Effects (explosions, impacts) | space-shooter music-1 |
| 5 | **Western Gulch** | western-fps-2d (cowboy, animals, background elements, items, HUD) | medieval-fantasy (leonard boss, snake), top-down-shooter (weapons, ammo pickups), Super Pixel Effects (explosions, splatters) | western-fps-2d theme-1 |
| 6 | **Ninja Temple** | ninja-adventure (ninja player, monsters, items, weapons, backgrounds) | Monsters_Creatures_Fantasy 1.3 (attack frames), rpg-battle-system (ghost/giant enemies), Super Pixel Effects (spell effects) | ninja-adventure music-1 |

## Cross-Pack Systems (used in ALL worlds)
- **Super Pixel Effects Gigapack** — explosions on enemy death, spell auras on
  power-ups, impact bursts on hits, smoke on dashes. The universal "juice" layer.
- **UIBundleFree** — menu / pause / game-over / settings panels & buttons.
- **Fonts** — space-shooter font-20x20 (HUD), ninja font8x8 (small text),
  western font-8x8, prehistoric font-20x20, rpg-battle-system font-16x16,
  medieval-fantasy font-1/2 (titles).
- **3d-character** — `preview.png` as world-intro card art; `2d-icon/head-*.png`
  as player icons on the world map; environment textures as decorative icons.
- **3d-vehicles** — `preview.gif` as animated world-select decorations;
  `preview.png` as "vehicle bay" unlock screen art.
- **3d-warriors** — `preview.png` as warrior-hall art; 32×32 textures as
  collectible icons.
- **backgrounds** pack — menu parallax background (41 bgs + 104 layers).
- **sample(idle&walk)** — fallback idle/walk animation for NPCs.
- **rpg-battle-system** — extra monsters (bat, boar, dino, ghost, giant, mimic,
  mushroom, reptile, slime, snake) as enemies across worlds; 80 items as
  collectibles; 24 backgrounds as level backgrounds.
- **medieval-fantasy** — hearts HUD, coins, potions, chests as collectibles.
- **ninja-adventure** — shuriken/kunai projectiles, food health pickups, scroll
  power-ups.
- **prehistoric-platformer** — food/health pickups, inventory HUD.
- **western-fps-2d** — 9 weapons as player weapon unlocks, items as collectibles,
  particles for effects.
- **space-shooter** — gems as collectibles, power-ups, shield effect.
- **32rogues** — weapon items as unlocks, animals as ambient creatures,
  autotiles for water.
- **Cute_Fantasy_Free** — animals as ambient, chest as collectible,
  fences/bridge/trees as decor.
- **MinifolksVillagers** — NPCs in farm world + world map.
- **Mana Seed Farmer** — farmer NPC + player skin in farm world.
- **Sunnyside** — crops as collectibles, chimney smoke ambient anim, tileset.
- **Monster_Creatures_Fantasy (1.3 + base)** — flying eye, goblin, mushroom,
  skeleton enemies in medieval/ninja worlds.
- **Tiny RPG Pack 02** — Demon_A & Blood Monster_A as mini-bosses.
- **top-down-shooter** — weapons as unlocks, tank/robot as enemies, ammo/medikit
  pickups.

## Features
- **Core:** run, jump, double-jump (unlockable), melee attack, ranged attack,
  dash, health, lives, score, coins
- **Enemies:** walkers, flyers, shooters, chargers, mini-bosses, bosses
- **Power-ups:** health (heart/food/medikit), weapon upgrades
  (sword → katana → gun), shield, speed (haste), double-jump
- **Collectibles:** coins, gems, crops, chests, keys
- **Levels:** 6 worlds × 2 stages + 1 boss each = 18 stages
- **UI screens:** Main menu (title, play, settings, credits), world map
  (6 worlds, lock/unlock), HUD (health, coins, score, lives, weapon), pause,
  game over, victory, settings (music/sfx toggle, reset progress)
- **Audio:** per-world music from that world's pack; SFX from packs
  (jump, coin, hit, explosion, power-up, boss)
- **Difficulty curve:** World 1 easy (slimes/skeletons) → World 6 hard
  (ninja monsters + boss); enemy speed/HP scale per world
- **Touch controls:** virtual joystick (left) + A (jump) / B (attack) buttons
  (right), pause button top-right; keyboard arrows/Z/X for desktop testing

## Tech
- **Phaser 3** — `pixelArt: true`, `antialias: false`, base resolution 480×270,
  `Scale.FIT` + `CENTER_BOTH` for crisp scaling on any phone
- **Vite** — dev server + production build
- **Capacitor** — wraps the web build as an Android app
- **GitHub Actions** — CI builds the debug APK (no local Android SDK needed)

## Asset Pipeline
- Original assets are **copied** (never moved) from
  `/storage/emulated/0/GameProject/Assets-to-Use/` into
  `public/assets/packs/<pack-name>/`, organized by pack.
- Phaser loads from `public/assets/` at runtime.
