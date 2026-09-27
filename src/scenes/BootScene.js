import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { CHARACTERS } from '../config/characters.js';

const P = (pack, path) => `assets/packs/${pack}/${path}`;

// Assets needed for menu/character select (loaded once at boot)
const ESSENTIAL_ASSETS = [
  // UI
  { key: 'ui_panel', type: 'image', url: P('UIBundleFree', 'UIBundleFree/FreeUI.png') },
  { key: 'ui_button', type: 'image', url: P('UIBundleFree', 'UIBundleFree/PastelUIFree.png') },
  // Menu background
  { key: 'menu_bg', type: 'image', url: P('backgrounds', 'backgrounds/1.png') },
  // 3D pack previews for world map
  { key: 'preview_3d_char', type: 'image', url: P('3d-character', 'preview.png') },
  { key: 'preview_3d_vehicles', type: 'image', url: P('3d-vehicles', 'preview.png') },
  { key: 'preview_3d_warriors', type: 'image', url: P('3d-warriors', 'preview.png') },
  // Character sprites
  ...CHARACTERS.map(c => ({
    key: `char_${c.id}`,
    type: 'image',
    url: P(c.pack, c.sprite),
  })),
  // Effect sprites
  { key: 'fx_explosion', type: 'image', url: P('Super Pixel Effects Gigapack (Free Version)', 'PNG/Explosions/epic_explosion_001/epic_explosion_001_large_orange/frame0000.png') },
  { key: 'fx_hit', type: 'image', url: P('Super Pixel Effects Gigapack (Free Version)', 'PNG/Impacts/impact_001/impact_001_large_yellow/frame0000.png') },
  // Fonts
  { key: 'font_hud', type: 'image', url: P('space-shooter', 'font-20x20.png') },
  { key: 'font_small', type: 'image', url: P('ninja-adventure', 'font8x8.png') },
  { key: 'font_title', type: 'image', url: P('prehistoric-platformer', 'title-font.png') },
  { key: 'font_medieval', type: 'image', url: P('medieval-fantasy', 'font-1.png') },
  // Misc
  { key: 'logo', type: 'image', url: P('space-shooter', 'logo.png') },
];

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Loading bar
    const { width, height } = this.cameras.main;
    const barBg = this.add.rectangle(width / 2, height / 2, 300, 20, 0x333344);
    const bar = this.add.rectangle(width / 2 - 145, height / 2, 0, 12, 0x00ffcc).setOrigin(0, 0.5);
    const label = this.add.text(width / 2, height / 2 - 20, 'Loading...', {
      fontFamily: 'monospace', fontSize: '12px', color: '#ffffff',
    }).setOrigin(0.5);

    this.load.on('progress', (v) => {
      bar.width = 290 * v;
    });

    this.load.on('complete', () => {
      barBg.destroy(); bar.destroy(); label.destroy();
    });

    for (const a of ESSENTIAL_ASSETS) {
      if (a.type === 'image') this.load.image(a.key, a.url);
      else if (a.type === 'audio') this.load.audio(a.key, a.url);
    }
  }

  create() {
    // Create animations for characters
    for (const c of CHARACTERS) {
      const key = `char_${c.id}`;
      if (this.textures.exists(key)) {
        const frameW = c.frameW || this.textures.get(key).getSourceImage().width;
        const frameH = c.frameH || this.textures.get(key).getSourceImage().height;
        const cols = c.cols || 1;
        const rows = c.rows || 1;

        // Create frames manually
        for (let r = 0; r < rows; r++) {
          for (let col = 0; col < cols; col++) {
            const frameName = `${key}_${r * cols + col}`;
            if (!this.textures.get(key).has(frameName)) {
              this.textures.get(key).add(frameName, 0, col * frameW, r * frameH, frameW, frameH);
            }
          }
        }

        // Create animations
        for (const [animName, frames] of Object.entries(c.anims)) {
          const animFrames = [];
          for (let i = frames[0]; i <= frames[1]; i++) {
            if (i < cols * rows) {
              animFrames.push({ key: `${key}_${i}` });
            }
          }
          if (animFrames.length > 0 && !this.anims.exists(`${key}_${animName}`)) {
            this.anims.create({
              key: `${key}_${animName}`,
              frames: animFrames,
              frameRate: animName === 'run' ? 10 : 6,
              repeat: animName === 'run' || animName === 'idle' ? -1 : 0,
            });
          }
        }
      }
    }

    this.scene.start('Menu');
  }
}
