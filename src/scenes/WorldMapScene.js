import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { WORLDS } from '../config/worlds.js';
import { createButton, createText } from '../objects/UI.js';

export class WorldMapScene extends Phaser.Scene {
  constructor() {
    super('WorldMap');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#0a0a12');

    // Title
    createText(this, width / 2, 25, 'SELECT WORLD', { fontSize: 16, color: '#00ffcc' });

    // Draw world nodes in a path
    const startX = 60;
    const endX = width - 60;
    const y = height / 2;
    const spacing = (endX - startX) / (WORLDS.length - 1);

    // Draw path
    for (let i = 0; i < WORLDS.length - 1; i++) {
      const x1 = startX + i * spacing;
      const x2 = startX + (i + 1) * spacing;
      this.add.line(0, 0, x1, y, x2, y, 0x333344, 0.5).setOrigin(0, 0);
    }

    // World nodes
    this.worldNodes = [];
    WORLDS.forEach((world, i) => {
      const x = startX + i * spacing;
      const unlocked = i < SaveManager.get('unlockedWorlds');
      const stars = SaveManager.getStars(i, 0) + SaveManager.getStars(i, 1);

      // Node circle
      const nodeColor = unlocked ? 0x00ffcc : 0x333344;
      const node = this.add.circle(x, y, 25, nodeColor, unlocked ? 0.8 : 0.3)
        .setInteractive({ useHandCursor: unlocked });

      // World icon
      if (unlocked && this.textures.exists(world.id)) {
        const icon = this.add.image(x, y, world.id).setScale(0.3);
      } else if (unlocked) {
        // Try loading the icon
        this.load.image(world.id, world.icon);
        this.load.once('complete', () => {
          this.add.image(x, y, world.id).setScale(0.3);
        });
        this.load.start();
      }

      // World name
      createText(this, x, y + 35, world.name, {
        fontSize: 8, color: unlocked ? '#ffffff' : '#555566',
      });

      // Stars
      if (stars > 0) {
        createText(this, x, y + 48, '★'.repeat(stars), {
          fontSize: 8, color: '#ffcc00',
        });
      }

      // Lock icon
      if (!unlocked) {
        createText(this, x, y, '🔒', { fontSize: 16 });
      }

      node.on('pointerdown', () => {
        if (unlocked) {
          this.selectWorld(i);
        }
      });

      this.worldNodes.push({ node, world, x, y, unlocked });
    });

    // Character info at bottom
    const charId = SaveManager.get('character');
    const charKey = `char_${charId}`;
    if (this.textures.exists(`${charKey}_0`)) {
      const charSprite = this.add.sprite(30, height - 30, `${charKey}_0`).setScale(1);
      if (this.anims.exists(`${charKey}_idle`)) charSprite.play(`${charKey}_idle`);
    }
    createText(this, 50, height - 35, SaveManager.get('custom').name, { fontSize: 9, color: '#aaaaaa' });
    createText(this, 50, height - 22, `Best: ${SaveManager.get('bestScore')}`, { fontSize: 8, color: '#666688' });

    // Back button
    createButton(this, width - 50, 25, 'BACK', () => {
      this.scene.start('Menu');
    }, { width: 70, height: 24, fontSize: 10 });

    // Stage selection popup
    this.stagePopup = null;
  }

  selectWorld(worldIdx) {
    // Show stage selection
    if (this.stagePopup) this.stagePopup.destroy();

    const { width, height } = this.cameras.main;
    const world = WORLDS[worldIdx];

    const popup = this.add.container(width / 2, height / 2);
    const bg = this.add.rectangle(0, 0, 220, 120, 0x1a1a2e, 0.95)
      .setStrokeStyle(2, 0x00ffcc);
    popup.add(bg);

    const title = createText(this, 0, -45, world.name, { fontSize: 12, color: '#00ffcc' });
    popup.add(title);

    const desc = createText(this, 0, -28, world.desc, { fontSize: 8, color: '#aaaaaa' });
    popup.add(desc);

    // Stage buttons
    for (let s = 0; s < 2; s++) {
      const stageBtn = createButton(this, -50 + s * 100, 10, `Stage ${s + 1}`, () => {
        this.scene.start('Level', { world: worldIdx, stage: s });
      }, { width: 80, height: 28, fontSize: 10 });
      popup.add(stageBtn);
    }

    // Boss button
    const bossBtn = createButton(this, 0, 45, 'BOSS', () => {
      this.scene.start('Level', { world: worldIdx, stage: 2 });
    }, { width: 80, height: 28, fontSize: 10, bgColor: 0x442222, borderColor: 0xff4444 });
    popup.add(bossBtn);

    // Close
    const closeBtn = createButton(this, 90, -45, 'X', () => {
      popup.destroy();
      this.stagePopup = null;
    }, { width: 24, height: 24, fontSize: 10 });
    popup.add(closeBtn);

    this.stagePopup = popup;
  }
}
