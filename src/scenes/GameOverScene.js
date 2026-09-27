import Phaser from 'phaser';
import { SaveManager } from '../config/save.js';
import { createButton, createText, createPanel } from '../objects/UI.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.score = data.score || 0;
    this.coins = data.coins || 0;
    this.world = data.world || 0;
    this.stage = data.stage || 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    this.cameras.main.setBackgroundColor('#1a0a0a');

    createPanel(this, width / 2, height / 2, 220, 160);
    createText(this, width / 2, height / 2 - 50, 'GAME OVER', { fontSize: 20, color: '#ff4444' });

    createText(this, width / 2, height / 2 - 15, `Score: ${this.score}`, { fontSize: 12, color: '#ffffff' });
    createText(this, width / 2, height / 2 + 5, `Coins: ${this.coins}`, { fontSize: 10, color: '#ffcc00' });

    createButton(this, width / 2, height / 2 + 35, 'RETRY', () => {
      this.scene.start('Level', { world: this.world, stage: this.stage });
    }, { width: 140, height: 30, fontSize: 12 });

    createButton(this, width / 2, height / 2 + 70, 'MENU', () => {
      this.scene.start('Menu');
    }, { width: 140, height: 30, fontSize: 12 });
  }
}
