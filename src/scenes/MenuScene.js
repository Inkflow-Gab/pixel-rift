import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { createButton, createText } from '../objects/UI.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Background
    if (this.textures.exists('menu_bg')) {
      const bg = this.add.image(width / 2, height / 2, 'menu_bg');
      bg.setDisplaySize(width, height);
      bg.setAlpha(0.6);
    } else {
      this.cameras.main.setBackgroundColor('#1a1a2e');
    }

    // Animated starfield particles
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 0.8)
      );
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Logo
    if (this.textures.exists('logo')) {
      const logo = this.add.image(width / 2, 60, 'logo');
      logo.setScale(1.2);
      this.tweens.add({
        targets: logo,
        y: 55,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      createText(this, width / 2, 60, 'PIXEL RIFT', { fontSize: 32, color: '#00ffcc' });
    }

    createText(this, width / 2, 90, 'A Dimension-Hopping Adventure', {
      fontSize: 10, color: '#aaaaaa',
    });

    // Character preview
    const charId = SaveManager.get('character');
    const charKey = `char_${charId}`;
    if (this.textures.exists(`${charKey}_0`)) {
      const preview = this.add.sprite(width / 2, 140, `${charKey}_0`);
      preview.setScale(2);
      if (this.anims.exists(`${charKey}_idle`)) {
        preview.play(`${charKey}_idle`);
      }
    }

    // Buttons
    const btnY = 190;
    createButton(this, width / 2, btnY, 'PLAY', () => {
      this.scene.start('WorldMap');
    }, { width: 200, height: 36, fontSize: 16 });

    createButton(this, width / 2, btnY + 44, 'CUSTOMIZE', () => {
      this.scene.start('Character');
    }, { width: 200, height: 32, fontSize: 14 });

    createButton(this, width / 2, btnY + 84, 'SETTINGS', () => {
      this.scene.start('Settings');
    }, { width: 200, height: 32, fontSize: 14 });

    // Version and credits
    createText(this, width / 2, height - 15, 'v1.0 Beta - Made by Gab', {
      fontSize: 8, color: '#666688',
    });

    // Music hint
    createText(this, width / 2, height - 30, 'Best experienced with sound on!', {
      fontSize: 8, color: '#555577',
    });
  }
}
