import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { createButton, createText, createPanel } from '../objects/UI.js';

export class SettingsScene extends Phaser.Scene {
  constructor() {
    super('Settings');
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#0a0a12');

    createPanel(this, width / 2, height / 2, 240, 200);
    createText(this, width / 2, height / 2 - 75, 'SETTINGS', { fontSize: 16, color: '#00ffcc' });

    // Music volume
    createText(this, width / 2 - 80, height / 2 - 40, 'Music:', { fontSize: 10, color: '#aaaaaa' });
    this.musicBar = this.add.rectangle(width / 2 + 20, height / 2 - 38, 100, 10, 0x333344).setOrigin(0, 0.5);
    this.musicFill = this.add.rectangle(width / 2 + 20, height / 2 - 38, 100 * SaveManager.get('settings').music, 10, 0x00ffcc).setOrigin(0, 0.5);
    this.musicBar.setInteractive({ useHandCursor: true });
    this.musicBar.on('pointerdown', (pointer) => {
      const pct = Phaser.Math.Clamp((pointer.x - (width / 2 + 20)) / 100, 0, 1);
      this.musicFill.width = 100 * pct;
      SaveManager.set('settings', { ...SaveManager.get('settings'), music: pct });
    });

    // SFX volume
    createText(this, width / 2 - 80, height / 2 - 15, 'SFX:', { fontSize: 10, color: '#aaaaaa' });
    this.sfxBar = this.add.rectangle(width / 2 + 20, height / 2 - 13, 100, 10, 0x333344).setOrigin(0, 0.5);
    this.sfxFill = this.add.rectangle(width / 2 + 20, height / 2 - 13, 100 * SaveManager.get('settings').sfx, 10, 0xff4444).setOrigin(0, 0.5);
    this.sfxBar.setInteractive({ useHandCursor: true });
    this.sfxBar.on('pointerdown', (pointer) => {
      const pct = Phaser.Math.Clamp((pointer.x - (width / 2 + 20)) / 100, 0, 1);
      this.sfxFill.width = 100 * pct;
      SaveManager.set('settings', { ...SaveManager.get('settings'), sfx: pct });
    });

    // Screen shake toggle
    createText(this, width / 2 - 80, height / 2 + 10, 'Shake:', { fontSize: 10, color: '#aaaaaa' });
    this.shakeBtn = createButton(this, width / 2 + 30, height / 2 + 10,
      SaveManager.get('settings').shake ? 'ON' : 'OFF',
      () => {
        const newVal = !SaveManager.get('settings').shake;
        SaveManager.set('settings', { ...SaveManager.get('settings'), shake: newVal });
        this.shakeBtn.list[1].setText(newVal ? 'ON' : 'OFF');
      }, { width: 50, height: 22, fontSize: 9 }
    );

    // Reset progress
    createButton(this, width / 2, height / 2 + 45, 'RESET PROGRESS', () => {
      SaveManager.reset();
      this.scene.restart();
    }, { width: 140, height: 26, fontSize: 9, bgColor: 0x442222, borderColor: 0xff4444 });

    // Credits
    createText(this, width / 2, height / 2 + 75, 'Made by Gab', { fontSize: 10, color: '#ffcc00' });
    createText(this, width / 2, height / 2 + 90, 'Pixel Rift v1.0 Beta', { fontSize: 8, color: '#666688' });

    // Back
    createButton(this, width / 2, height - 25, 'BACK', () => {
      this.scene.start('Menu');
    }, { width: 120, height: 28, fontSize: 12 });
  }
}
