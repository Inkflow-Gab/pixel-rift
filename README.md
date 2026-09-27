# Pixel Rift

**A dimension-hopping 2D action platformer** built with Phaser 3, Vite, and Capacitor.

Made by **Gab**

## About

A cosmic tear has shattered the world into six floating Rift Realms. You are the **Riftwalker**, a dimension-hopping hero who jumps through portals to defeat each realm's boss, restore the rift crystal, and stitch the world back together.

## Features

- **6 unique worlds**, each with its own theme, enemies, music, and assets
- **18 stages** (2 stages + boss per world)
- **6 playable characters** from different asset packs, each with unique stats
- **Character customization**: tint color, name, and trail effects
- **Touch controls**: virtual joystick + A/B buttons (keyboard supported too)
- **Power-ups**: health, weapon upgrades, shields, speed boosts
- **Collectibles**: coins, gems, crops, chests
- **Boss fights** at the end of each world
- **Progress saving** via localStorage
- **Settings**: music/SFX volume, screen shake toggle, reset progress

## Worlds

1. **Sunnyside Farm** - A peaceful farm overrun by slimes and skeletons
2. **Medieval Keep** - A dark castle filled with goblins and the undead
3. **Prehistoric Isle** - A jungle island ruled by dinosaurs
4. **Starship Void** - An asteroid field in deep space (side-scrolling shooter)
5. **Western Gulch** - A desert town where outlaws rule the streets
6. **Ninja Temple** - An ancient temple guarded by shadow warriors

## How to Play

### Download the APK

1. Go to the **Actions** tab on GitHub
2. Click on the latest **Build APK** workflow run
3. Download the **pixel-rift-apk** artifact
4. Install the APK on your Android device

### Controls

- **Left side**: Virtual joystick for movement
- **A button** (right): Jump
- **B button** (right): Attack
- **Pause button** (top-right): Pause menu
- **Keyboard**: Arrow keys to move, Z to jump, X to attack, ESC to pause

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
npm run dev
```

### Build for production

```bash
npm run build
```

### Android (Capacitor)

```bash
npx cap add android
npx cap sync android
npx cap open android
```

## Tech Stack

- **Phaser 3** - Game engine
- **Vite** - Build tool
- **Capacitor** - Android packaging
- **GitHub Actions** - CI/CD for APK builds

## Asset Packs Used

This game uses 22 different asset packs, including:
- 32rogues, Cute Fantasy, Medieval Fantasy, Ninja Adventure
- Prehistoric Platformer, Space Shooter, Top-Down Shooter
- Western FPS 2D, RPG Battle System, and many more

See `DESIGN.md` for the full design document and asset mapping.

## License

All asset packs retain their original licenses. Game code is original.
